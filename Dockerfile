# Stage 1: Build the application
FROM node:18.19.0-alpine AS builder

WORKDIR /knowtate

# Copy the package files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn add canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas && yarn install --frozen-lockfile --production

# Copy the rest of the project files
COPY . .

# Build the project
RUN yarn build

# Stage 2: Run the application
FROM node:18.19.0-alpine

WORKDIR /knowtate

# Copy necessary files from the builder stage
COPY --from=builder /knowtate/.next ./.next
COPY --from=builder /knowtate/node_modules ./node_modules
COPY --from=builder /knowtate/public ./public
COPY --from=builder /knowtate/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]
