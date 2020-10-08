FROM registry.access.redhat.com/ubi8/nodejs-12 as builder
USER root

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY .npmrc package.json tsconfig.json ./
COPY src ./src 

RUN yum install --disableplugin=subscription-manager -y python2 \
  && npm install --production --silent \
  && npm install -g typescript \
  && tsc \
  && rm -f .npmrc \
  && mkdir /tmp/nodejs12 \
  && yum remove -y nodejs \
  && yum install -y --downloadonly --downloaddir=/tmp/nodejs12 nodejs

FROM registry.access.redhat.com/ubi8/ubi-minimal:latest
USER root
LABEL name="<%= name %>" \
      vendor="IBM" \
      version="<%= version %>" \
      release="1.0" \
      summary="<%= summary %>" \
      description="<%= description %>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=builder /tmp/nodejs12 /tmp/nodejs12

RUN mkdir /licenses \
  && microdnf update \
  && microdnf install python2 \
  && rpm -i /tmp/nodejs12/* \
  && rm -rf /tmp/nodejs12 \
  && microdnf clean all

COPY licenses /licenses

USER 1001

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/src ./src

ENV NODE_ENV production
EXPOSE 3000

CMD npm start
