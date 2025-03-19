# Kontext21 Node.js Library

# Work in progress.

![https://github.com/kontext21/k21-node/actions](https://github.com/kontext21/k-node/workflows/CI/badge.svg)

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

### Build package

```
yarn run bp
```

### Test

With [ava](https://github.com/avajs/ava), run `yarn test/npm run test` to testing native addon. You can also switch to another testing framework if you want.

### CI

With GitHub Actions, each commit and pull request will be built and tested automatically in [`node@14`, `node@16`, `@node18`] x [`macOS`, `Linux`, `Windows`] matrix. You will never be afraid of the native addon broken in these platforms.

### Release

Release native package is very difficult in old days. Native packages may ask developers who use it to install `build toolchain` like `gcc/llvm`, `node-gyp` or something more.

With `GitHub actions`, we can easily prebuild a `binary` for major platforms. And with `N-API`, we should never be afraid of **ABI Compatible**.

The other problem is how to deliver prebuild `binary` to users. Downloading it in `postinstall` script is a common way that most packages do it right now. The problem with this solution is it introduced many other packages to download binary that has not been used by `runtime codes`. The other problem is some users may not easily download the binary from `GitHub/CDN` if they are behind a private network (But in most cases, they have a private NPM mirror).

In this package, we choose a better way to solve this problem. We release different `npm packages` for different platforms. And add it to `optionalDependencies` before releasing the `Major` package to npm.

`NPM` will choose which native package should download from `registry` automatically. You can see [npm](./npm) dir for details. And you can also run `yarn add @napi-rs/package-template` to see how it works.

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


## Release package

Ensure you have set your **NPM_TOKEN** in the `GitHub` project setting.

In `Settings -> Secrets`, add **NPM_TOKEN** into it.

When you want to release the package:

```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]

git push
```

GitHub actions will do the rest job for you.

## List of modifications 

1. Click **Use this template** on the top right corner of the [napi-rs/package-template](https://github.com/napi-rs/package-template) repository.
2. **Clone** this project.
3. Run `yarn install` to install dependencies.
4. Run `npx napi rename -n [name]` command under the project folder to rename your package:
```
npx napi rename -n @kontext21/k21
? napi name: @kontext21/k21
? repository: Leave empty to skip https://github.com/kontext21/k21-node
? description: Leave empty to skip Node.js Library for the Kontext21 SDK
```
5. removed other build targets except macOS arm64.
6. Ensure you have set your NPM_TOKEN in the GitHub project setting. In Settings -> Secrets, add NPM_TOKEN into it.
7. Run `npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]` to release the package.
8. `git push`
