FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

# ✅ Allow scripts to run so deps install correctly
RUN yarn install --verbose

# ✅ Disable Rollup native binary resolution
ENV ROLLUP_NO_NATIVE=true

COPY . .

RUN yarn build

EXPOSE 4173

CMD ["yarn", "preview"]
