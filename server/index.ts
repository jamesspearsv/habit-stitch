export default {
  fetch() {
    return new Response(`Running in ${navigator.userAgent}!`)
  },
} satisfies ExportedHandler<Env>
