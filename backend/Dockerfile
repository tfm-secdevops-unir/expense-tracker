FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
# npm, npx, corepack y yarn solo hacen falta para instalar: se retiran de la imagen final.
RUN npm ci --omit=dev \
 && rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg
COPY src ./src
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "src/server.js"]
