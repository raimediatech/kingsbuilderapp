
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function storeAccessToken(shop, accessToken) {
  if (!shop || !accessToken) return;
  await prisma.shopifySession.upsert({
    create: { id: undefined,
    where: { shop },
    update: { accessToken },
    create: { shop, accessToken },
  });
  console.log('✅ Stored token for', shop);
}

async function getAccessToken(shop) {
  if (!shop) return null;
  const sess = await prisma.shopifySession.findUnique({ where: { shop } });
  return sess ? sess.accessToken : null;
}

module.exports = { storeAccessToken, getAccessToken };
