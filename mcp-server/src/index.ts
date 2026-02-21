import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { google, androidpublisher_v3 } from "googleapis";

const server = new McpServer({
  name: "google-play-developer",
  version: "0.1.0",
});

function getAuthClient() {
  const keyFile = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyFile) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is required. " +
        "Set it to the path of your Google Cloud service account JSON key file."
    );
  }

  return new google.auth.GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
}

function getClient(): androidpublisher_v3.Androidpublisher {
  const auth = getAuthClient();
  return google.androidpublisher({ version: "v3", auth });
}

// Tool: Get app details
server.tool(
  "get-app-details",
  "Get app details including version, status, and configuration from Google Play Console",
  {
    packageName: z
      .string()
      .describe("Android package name (e.g., com.example.app)"),
  },
  async ({ packageName }) => {
    try {
      const client = getClient();

      // Create an edit to read app details
      const edit = await client.edits.insert({
        packageName,
      });

      const editId = edit.data.id!;

      // Get app details
      const details = await client.edits.details.get({
        packageName,
        editId,
      });

      // Get listings (default language)
      const listings = await client.edits.listings.list({
        packageName,
        editId,
      });

      // Delete the edit (we're read-only)
      await client.edits.delete({ packageName, editId });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                details: details.data,
                listings: listings.data.listings?.map((l) => ({
                  language: l.language,
                  title: l.title,
                  shortDescription: l.shortDescription,
                  fullDescription: l.fullDescription?.substring(0, 200) + "...",
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get release tracks
server.tool(
  "get-release-tracks",
  "Get release track information (internal, alpha, beta, production) for an app",
  {
    packageName: z
      .string()
      .describe("Android package name (e.g., com.example.app)"),
    track: z
      .enum(["internal", "alpha", "beta", "production"])
      .optional()
      .describe(
        "Specific track to query. If omitted, returns all tracks."
      ),
  },
  async ({ packageName, track }) => {
    try {
      const client = getClient();

      const edit = await client.edits.insert({ packageName });
      const editId = edit.data.id!;

      let tracks;
      if (track) {
        const result = await client.edits.tracks.get({
          packageName,
          editId,
          track,
        });
        tracks = [result.data];
      } else {
        const result = await client.edits.tracks.list({
          packageName,
          editId,
        });
        tracks = result.data.tracks;
      }

      await client.edits.delete({ packageName, editId });

      const formatted = tracks?.map((t) => ({
        track: t.track,
        releases: t.releases?.map((r) => ({
          name: r.name,
          status: r.status,
          versionCodes: r.versionCodes,
          releaseNotes: r.releaseNotes?.map((n) => ({
            language: n.language,
            text: n.text?.substring(0, 100),
          })),
          inAppUpdatePriority: r.inAppUpdatePriority,
        })),
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(formatted, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get user reviews
server.tool(
  "get-reviews",
  "Get user reviews and ratings for an app from Google Play",
  {
    packageName: z
      .string()
      .describe("Android package name (e.g., com.example.app)"),
    maxResults: z
      .number()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum number of reviews to return (1-100, default 20)"),
    translationLanguage: z
      .string()
      .optional()
      .describe(
        "Language code to translate reviews to (e.g., 'en' for English)"
      ),
  },
  async ({ packageName, maxResults, translationLanguage }) => {
    try {
      const client = getClient();

      const result = await client.reviews.list({
        packageName,
        maxResults,
        translationLanguage,
      });

      const reviews = result.data.reviews?.map((review) => {
        const comment = review.comments?.[0]?.userComment;
        const devReply = review.comments?.[1]?.developerComment;
        return {
          reviewId: review.reviewId,
          authorName: review.authorName,
          starRating: comment?.starRating,
          text: comment?.text,
          lastModified: comment?.lastModified?.seconds
            ? new Date(
                Number(comment.lastModified.seconds) * 1000
              ).toISOString()
            : undefined,
          appVersionCode: comment?.appVersionCode,
          appVersionName: comment?.appVersionName,
          device: comment?.device,
          androidOsVersion: comment?.androidOsVersion,
          deviceMetadata: comment?.deviceMetadata
            ? {
                manufacturer: comment.deviceMetadata.manufacturer,
                deviceClass: comment.deviceMetadata.deviceClass,
                screenDensityDpi: comment.deviceMetadata.screenDensityDpi,
              }
            : undefined,
          developerReply: devReply
            ? {
                text: devReply.text,
                lastModified: devReply.lastModified?.seconds
                  ? new Date(
                      Number(devReply.lastModified.seconds) * 1000
                    ).toISOString()
                  : undefined,
              }
            : undefined,
        };
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                totalReviews: result.data.reviews?.length ?? 0,
                reviews,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get a specific review
server.tool(
  "get-review",
  "Get a specific user review by ID",
  {
    packageName: z
      .string()
      .describe("Android package name (e.g., com.example.app)"),
    reviewId: z.string().describe("The review ID to retrieve"),
    translationLanguage: z
      .string()
      .optional()
      .describe("Language code to translate review to"),
  },
  async ({ packageName, reviewId, translationLanguage }) => {
    try {
      const client = getClient();

      const result = await client.reviews.get({
        packageName,
        reviewId,
        translationLanguage,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get app bundle / APK details
server.tool(
  "get-bundle-details",
  "Get details about uploaded app bundles and APKs",
  {
    packageName: z
      .string()
      .describe("Android package name (e.g., com.example.app)"),
  },
  async ({ packageName }) => {
    try {
      const client = getClient();

      const edit = await client.edits.insert({ packageName });
      const editId = edit.data.id!;

      const [bundles, apks] = await Promise.all([
        client.edits.bundles.list({ packageName, editId }),
        client.edits.apks.list({ packageName, editId }),
      ]);

      await client.edits.delete({ packageName, editId });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                bundles: bundles.data.bundles?.map((b) => ({
                  versionCode: b.versionCode,
                  sha256: b.sha256,
                })),
                apks: apks.data.apks?.map((a) => ({
                  versionCode: a.versionCode,
                  binary: a.binary
                    ? { sha256: a.binary.sha256 }
                    : undefined,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
