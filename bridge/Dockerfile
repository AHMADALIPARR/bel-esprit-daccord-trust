FROM node:24-alpine
WORKDIR /app
COPY bridge/server.mjs ./bridge/server.mjs
COPY worker/index.mjs ./worker/index.mjs
COPY content/knowledge.json ./content/knowledge.json
USER node
ENV BRIDGE_BIND=0.0.0.0
EXPOSE 8788
CMD ["node", "bridge/server.mjs"]
