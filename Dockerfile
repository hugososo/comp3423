FROM node:14.17.3-buster

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
COPY . .
RUN npm run build
COPY /build /build
RUN yarn global add serve
COPY . .
EXPOSE 5000
CMD ["serve", "-s", "-n" ,"build"]

