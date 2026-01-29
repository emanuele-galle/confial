# Architecture

**Analysis Date:** 2026-01-29

## Pattern Overview

**Overall:** Multi-layer autonomous development loop with modular component architecture

**Key Characteristics:**
- Command-driven orchestration layer (CLI → Ralph loop)
- Modular library system with reusable components
- Persistent state management via JSON files
- Rate-limited API integration with circuit breaker pattern
- Session continuity and context preservation across loop iterations

## Layers

**CLI/Command Layer:**
- Purpose: Parse user input, manage flags, orchestrate execution
- Location: `ralph_loop.sh` (main entry), `ralph_monitor.sh` (monitoring), `setup.sh` (initialization)
- Contains: Argument parsing, flag handling, main loop execution
- Depends on: Library components (circuit_breaker.sh, response_analyzer.sh, etc.)
- Used by: Command-line users, GitHub Actions CI/CD, PM2 process management

**Orchestration Layer:**
- Purpose: Coordinate autonomous loop cycles, manage state transitions, detect exit conditions
- Location: `ralph_loop.sh` (lines 277-450+)
- Contains: Loop execution, call counting, session management, exit detection
- Depends on: Response analyzer, circuit breaker, timeout utilities
- Used by: CLI layer, monitoring systems

**Library/Component Layer:**
- Purpose: Modular reusable functionality
- Location: `lib/` directory
- Contains: `response_analyzer.sh`, `circuit_breaker.sh`, `date_utils.sh`, `timeout_utils.sh`
- Depends on: External tools (jq, date, timeout, bash)
- Used by: All upper layers

**State Persistence Layer:**
- Purpose: Track loop progress, session IDs, circuit breaker state, analysis results
- Location: `.ralph/` directory (hidden subfolder per project)
- Contains: JSON status files, logs, session tracking
- Key files: `.call_count`, `.circuit_breaker_state`, `.response_analysis`, `.claude_session_id`
- Used by: Orchestration layer for decision-making

**Project Template Layer:**
- Purpose: Bootstrap new Ralph-managed projects
- Location: `templates/` directory → copied to `.ralph/` on `setup.sh`
- Contains: `PROMPT.md` (instructions), `@fix_plan.md` (task list), `@AGENT.md` (build info), `specs/` (specs)
- Used by: Project initialization, autonomous development guidance

## Data Flow

**Loop Iteration Cycle (Simplified):**

1. **Input Phase** → Read PROMPT.md and @fix_plan.md from `.ralph/`
2. **Execution Phase** → Call Claude Code CLI with modern flags (json output, allowed tools, session continuity)
3. **Analysis Phase** → Parse response via `response_analyzer.sh` (JSON format detection, exit signals, test detection)
4. **State Update Phase** → Update `.response_analysis`, `.call_count`, `.exit_signals`
5. **Decision Phase** → Check circuit breaker + completion conditions via `circuit_breaker.sh`
6. **Output Phase** → Log results, update status.json, emit monitoring data
7. **Loop Control** → Continue or exit based on exit conditions

**Call Counter & Rate Limiting:**
- Read: `$CALL_COUNT_FILE` (.call_count) → get current call count
- Increment: After each Claude call
- Reset: At hour boundary (automatic via $TIMESTAMP_FILE)
- Block: If count >= MAX_CALLS_PER_HOUR (100), wait with countdown timer

**Session Management:**
```
Initialize: check_claude_version() → get/store session ID in .claude_session_id
Persist: save_claude_session() → extract sessionId from Claude JSON response
Resume: --continue flag injects session ID in next loop
Reset: manually via --reset-session or auto-reset on circuit breaker open
```

**Exit Detection (Multi-condition):**
```
Check 1: Completion indicators >= 2 AND EXIT_SIGNAL: true (from .response_analysis)
         → Exit with "project_complete"
Check 2: Done signals >= 2 (repeated completion from Claude)
         → Exit with "multiple_done_signals"
Check 3: Test-only loops >= 3 (testing dominates iterations)
         → Exit with "too_many_test_loops"
Check 4: All items in @fix_plan.md marked complete
         → Exit with "checklist_complete"
Check 5: Circuit breaker OPEN (stagnation/errors detected)
         → Exit with "circuit_breaker_open"
```

**State Management:**
- Current loop counter → `status.json` (.loop_count)
- Files modified this loop → `.response_analysis` (.analysis.files_modified)
- Work type → `.response_analysis` (.analysis.work_type)
- Previous responses → `.ralph/logs/` (timestamped per iteration)
- Session history → `.ralph_session_history` (last 50 transitions)

## Key Abstractions

**Circuit Breaker Pattern:**
- Purpose: Prevent runaway token consumption by detecting stagnation
- Examples: `lib/circuit_breaker.sh`, lines 1-150
- Pattern: Three-state machine (CLOSED/HALF_OPEN/OPEN)
- Thresholds: CB_NO_PROGRESS_THRESHOLD=3, CB_SAME_ERROR_THRESHOLD=5, CB_OUTPUT_DECLINE_THRESHOLD=70%

**Response Analyzer:**
- Purpose: Extract structured insights from Claude's natural language + JSON output
- Examples: `lib/response_analyzer.sh`
- Pattern: Format detection → JSON parsing → field extraction → confidence scoring
- Outputs: Work type, files modified, exit signals, completion indicators

**Rate Limiter:**
- Purpose: Enforce API call limits per hour
- Examples: `ralph_loop.sh` (lines 221-275)
- Pattern: Counter file-based tracking with hourly reset

**Session Manager:**
- Purpose: Maintain context across loop iterations
- Examples: `lib/response_analyzer.sh` (session functions) + `ralph_loop.sh` (initialization)
- Pattern: Persistent storage in `.claude_session_id` with 24-hour expiration

## Entry Points

**`ralph_loop.sh`:**
- Location: `ralph_loop.sh` (main executable)
- Triggers: `ralph --monitor`, `ralph`, `ralph --calls 50`
- Responsibilities: Parse CLI args, initialize directories, execute main loop, coordinate all components

**`setup.sh`:**
- Location: `setup.sh`
- Triggers: `ralph-setup my-project` (installed via install.sh)
- Responsibilities: Create project structure, copy templates, initialize git, create .ralph/ subfolder

**`ralph_monitor.sh`:**
- Location: `ralph_monitor.sh`
- Triggers: `ralph --monitor` (integrated), `ralph-monitor` (standalone)
- Responsibilities: Live dashboard via tmux, display loop status, show logs in real-time

**`ralph_import.sh`:**
- Location: `ralph_import.sh`
- Triggers: `ralph-import my-prd.md`
- Responsibilities: Convert PRD/spec documents to Ralph format (PROMPT.md, @fix_plan.md, specs/)

## Error Handling

**Strategy:** Multi-layer error detection with false-positive elimination

**Patterns:**

1. **JSON Field False-Positive Filter** (`lib/circuit_breaker.sh` + `lib/response_analyzer.sh`):
   - Stage 1: Filter `grep -v '"[^"]*error[^"]*":'` to exclude JSON field names containing "error"
   - Stage 2: Match real errors via context: `Error:`, `ERROR:`, `Exception`, `Failed`
   - Result: Eliminates false "errors" from JSON metadata fields

2. **Multi-line Error Detection** (`lib/circuit_breaker.sh` line ~300):
   - Requirement: ALL error lines must appear in ALL recent history files
   - Tool: `grep -qF` for fixed-string literal matching (avoid regex edge cases)
   - Purpose: Prevent false positives when distinct errors occur simultaneously

3. **JSON Parsing Fallback** (`lib/response_analyzer.sh`):
   - Try: Parse with `jq` (structured format)
   - Fallback: Parse text output if jq fails (backward compatibility)
   - Default: Return safe defaults on parse failure (prevents crash)

4. **Circuit Breaker Recovery**:
   - Auto-transition: CLOSED → HALF_OPEN → CLOSED (if progress detected)
   - Manual reset: `--reset-circuit` flag
   - Auto-reset: On session/project completion

## Cross-Cutting Concerns

**Logging:**
- Approach: Colored terminal output with timestamps
- Pattern: `log_status()` function in ralph_loop.sh
- Levels: SUCCESS (green), WARN (yellow), ERROR (red), INFO (blue)
- Output: stdout + `.ralph/logs/` directory (timestamped files)

**Validation:**
- CLI args: Validate `--allowed-tools` against `VALID_TOOL_PATTERNS` array
- JSON responses: Validate with `jq empty` before parsing
- File operations: Check existence + write permissions before use
- Rate limits: Enforce MAX_CALLS_PER_HOUR with automatic reset

**Authentication & Sessions:**
- Approach: Session continuity via Claude CLI `--continue` flag
- Persistence: `.claude_session_id` file (24-hour expiration)
- Auto-reset: On circuit breaker open, manual interrupt, project completion
- Fallback: Use `--no-continue` for isolated iterations if needed

---

*Architecture analysis: 2026-01-29*
