# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this plugin, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Report via GitHub private vulnerability reporting at https://github.com/crgeee/google-playstore-toolkit/security/advisories/new

## Scope

This plugin is a static analysis tool that reads source code files. It does not:

- Execute your app code
- Make network requests to external services (MCP server is opt-in and not auto-enabled)
- Store or transmit any data from your project
- Modify your source code

The plugin performs only read operations. One component has Bash access for read-only shell operations: `assets-metadata-reviewer` uses shell commands to inspect icon file properties. The `review-app` command uses Bash for project type detection. No component writes to your source files.

## Dependencies

The core plugin has no runtime dependencies. It consists entirely of markdown files (agents, commands, skills) interpreted by Claude Code.

The optional MCP server (not auto-enabled) has npm dependencies (`googleapis`, `@modelcontextprotocol/sdk`) which are only relevant if a user explicitly builds and configures it.
