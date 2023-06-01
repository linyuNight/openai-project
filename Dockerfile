FROM node:18-alpine
WORKDIR /
COPY . .
RUN yarn install
CMD npm run dev
EXPOSE 3000