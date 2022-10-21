# JSON RPC and RUST SDK examples

## Introduction

This repo holds examples on how to use the json rpc and rust sdk to communicate with the sui network.
Assumptions:
- The environment is set up and an address exists as outlined <a href="https://docs.sui.io/build/devnet">here</a>, we will use devnet but you can do the same on a local installation
- Basic knowledge on blockchains and Sui exists, you can start learning <a href="https://docs.sui.io/devnet/learn">here</a>
- For the Rust SDK, working knowledge of Rust exists
- Working knowledge of Sui is expected to be gained when finishing a walkthrough, initially we assume that this is your first interaction, so we will go through many concepts and explain them in as much detail as possible.

## Scope
We will examine most calls in a methodical fashion starting from simple calls and slowly going to more complex examples.

## Usage
Two folders `json_rpc_examples` and `rust_sdk_examples` hold the examples and a `Walkthrough.md` which explains each example starting from the simplest to the most complex. The example files are sorted in aplphabetical order but we will go through them in order of complexity. Feel free to skip to the more relevant for your use case and keep in mind that some examples should have been visited first, your address should hold SUI tokens in order to do the stuff needed in next examples.