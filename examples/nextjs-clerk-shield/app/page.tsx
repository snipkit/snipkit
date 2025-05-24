export default function Home() {
  return (
    <>
      <main>
        <div>
          <h1>Snipkit Shield / Clerk Authentication Example</h1>
          <p>
            This shows Snipkit Shield installed in a Next.js application with
            Clerk authentication.
          </p>
          <ul>
            <li>
              <a href="/api/private">
                <code>/api/private</code>
              </a>{" "}
              uses Clerk authentication.
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}