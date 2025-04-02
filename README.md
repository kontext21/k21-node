# Kontext21 Node.js Library

# Work in progress.

> Based on the amazing [napi-rs/package-template](https://github.com/napi-rs/package-template) project.

# Usage

## Install this test package

```
yarn add @kontext21/k21
```

## Support matrix

### Operating Systems

|                  | node14 | node16 | node18 |
| ---------------- | ------ | ------ | ------ |
| Windows x64      | ✓      | ✓      | ✓      |
| Windows x32      | ✓      | ✓      | ✓      |
| Windows arm64    | ✓      | ✓      | ✓      |
| macOS x64        | ✓      | ✓      | ✓      |
| macOS arm64      | ✓      | ✓      | ✓      |

## Ability

### Build

After `yarn build/npm run build` command, you can see `package-template.[darwin|win32|linux].node` file in project root. This is the native addon built from [lib.rs](./src/lib.rs).

### For local Development: Build Rust + Node, create TS file and move them into bin/ folder

```
yarn run bp
```

### Test

run `yarn test/npm run test` to testing native addon.

## Develop requirements

- Install the latest `Rust`
- Install `Node.js@10+` which fully supported `Node-API`
- Install `yarn@1.x`

## Test in local

- yarn
- yarn build
- yarn test
- yarn run bp 

Afterwards you can import the locally build package into your project:

```
npm install ../k21-node/kontext21-k21-0.17.0.tgz
```