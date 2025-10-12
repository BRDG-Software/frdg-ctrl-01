export async function GET(request) {
  // Handle GET request
  return new Response(JSON.stringify({ message: 'what slurp' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}