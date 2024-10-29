FROM node:18 AS builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY ./prisma ./prisma
COPY . .

# Install app dependencies
RUN yarn
RUN yarn build

FROM node:18-buster
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma ./prisma/

EXPOSE 3001

CMD [ "yarn", "start:migrate:prod" ]