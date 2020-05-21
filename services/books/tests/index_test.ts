const { run } = Deno;
import {
  assertEquals,
  assertStrictEq,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { BufReader, ReadLineResult } from "https://deno.land/std/io/bufio.ts";

/** Example of how to do basic tests */
Deno.test("booksPut", async () => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  console.log(Deno.cwd() + "/index.ts");
  const process = Deno.run({
    cmd: [
      Deno.execPath(),
      "run",
      "-A",
      Deno.cwd() + "/index.ts",
    ],
    cwd: "null",
    stdout: "piped",
  });

  let conn: Deno.Conn | undefined;
  try {
    const processReader = new BufReader(process.stdout!);
    const message = await processReader.readLine();

    assertNotEquals(message, null);
    assertStrictEq(
      decoder.decode((message as ReadLineResult).line).trim(),
      "Listening on 0.0.0.0:8080",
    );

    conn = await Deno.connect({ hostname: "127.0.0.1", port: 8080 });
    const connReader = new BufReader(conn);

    await conn.write(encoder.encode("Hello echo_server\n"));
    const result = await connReader.readLine();

    assertNotEquals(result, null);

    const actualResponse = decoder
      .decode((result as ReadLineResult).line)
      .trim();
    const expectedResponse = "Hello echo_server";

    assertStrictEq(actualResponse, expectedResponse);
  } finally {
    conn?.close();
    process.stdout!.close();
    process.close();
  }
});

Deno.test("t2", function (): void {
  assertEquals("world", "world");
});

/** A more complicated test that runs a subprocess. */
Deno.test("catSmoke", async function (): Promise<void> {
  const p = run({
    cmd: [
      Deno.execPath(),
      "run",
      "--allow-read",
      "examples/cat.ts",
      "README.md",
    ],
    stdout: "null",
    stderr: "null",
  });
  const s = await p.status();
  assertEquals(s.code, 0);
  p.close();
});
