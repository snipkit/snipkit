export default function Home() {
  return (
    <>
      <main>
        <div>
          <h1>Snipkit Rate Limit / Clerk Authentication Example</h1>
          <p>
            This API route is protected with an Snipkit rate limit.
            <a href="/api/snipkit">
              <code>/api/snipkit</code>
            </a>
          </p>
          <ul>
            <li>
              Unauthenticated users receive a low rate limit based on the user
              IP address.
            </li>
            <li>
              Users authenticated with Clerk have a higher rate limit based on
              the Clerk user ID.
            </li>
          </ul>

          <h2>Testing the private endpoint</h2>
          <ol>
            <li>
              Visit{" "}
              <a href="/api/token">
                <code>/api/token</code>
              </a>{" "}
              and then log in to Clerk.
            </li>
            <li>
              You will be redirected back to the <code>/api/token</code> page
              with a token output on the page.
            </li>
            <li>
              Visit{" "}
              <a href="/api/snipkit">
                <code>/api/snipkit</code>
              </a>{" "}
              in your browser or use the token to send several <code>curl</code>{" "}
              requests to <code>/api/private</code>
            </li>
          </ol>

          <pre>
            curl -v http://localhost:3000/api/snipkit -H &quot;Authorization: Bearer
            TOKENHERE&quot;
          </pre>
        </div>
      </main>
    </>
  );
}