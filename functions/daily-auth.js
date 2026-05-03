export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/daily/')) {
    const auth = request.headers.get('Authorization');
    if (!auth || !isValid(auth)) {
      return new Response('需要验证身份才能访问', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="私密日记"'
        }
      });
    }
    // 密码正确，继续请求（交给 Pages 正常处理）
    return context.next();
  }
  
  // 其他路径直接放行
  return context.next();
}

function isValid(auth) {
  const [scheme, encoded] = auth.split(' ');
  if (!encoded) return false;
  const [user, password] = atob(encoded).split(':');
  return user === 'me' && password === '580231';
}