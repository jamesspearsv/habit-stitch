export default {
  fetch(request) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api')) {
      return Response.json({ message: `Running in ${navigator.userAgent}! Visiting ${url}` })
    }

    return new Response(null, { status: 404 })
  },
} satisfies ExportedHandler<Env>
