FROM golang:1.23.5-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN apk --no-cache add gcc musl-dev && \
    CGO_ENABLED=1 GOOS=linux go build -o localbooru-be

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/localbooru-be .
COPY --from=builder /app/config.json .
CMD ["./localbooru-be"]