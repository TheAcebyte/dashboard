FROM node:23-slim AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run db:push
RUN npm run build

FROM node:23-slim

WORKDIR /app

COPY package*.json .
RUN npm install --production

COPY --from=build /app .

CMD ["npm", "run", "start"]
