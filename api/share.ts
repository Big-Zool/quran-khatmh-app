// No need to import Request, it's global in the Edge Runtime


export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const name = searchParams.get('name') ?? 'فاعل خير';

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const origin = `${protocol}://${host}`;

    const ogImageUrl = `${origin}/og/khatmah?name=${encodeURIComponent(name)}`;
    const redirectUrl = `${origin}/join/${slug}${name ? `?name=${encodeURIComponent(name)}` : ''}`;

    return new Response(
        `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>صدقة جارية - ${name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="صدقة جارية - ${name}">
  <meta property="og:description" content="انضم إلينا في ختم القرآن الكريم">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="صدقة جارية - ${name}">
  <meta name="twitter:description" content="انضم إلينا في ختم القرآن الكريم">
  <meta name="twitter:image" content="${ogImageUrl}">

  <!-- Redirect to SPA -->
  <meta http-equiv="refresh" content="0; url=${redirectUrl}">
  <script>
    window.location.href = "${redirectUrl}";
  </script>
</head>
<body style="background: #0f766e; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <div style="text-align: center;">
    <h1>جاري التحويل...</h1>
    <p>صدقة جارية عن ${name}</p>
  </div>
</body>
</html>`,
        {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        }
    );
}
