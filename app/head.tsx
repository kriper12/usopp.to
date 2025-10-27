// app/head.tsx
export default function Head() {
  return (
    <>
      <title>RX Max - Premium HD Streaming</title>
      <meta
        name="description"
        content="Your premium destination for HD streaming. Discover unlimited movies and TV shows."
      />

      {/* Favicon for browsers */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  )
}
