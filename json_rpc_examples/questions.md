# Questions

1) Wtf is an event?
2) What exactly do we get from the other request_type 's?
3) What are events and what event streams?
4) What is tx context??
5) https://docs.sui.io/sui-jsonrpc#sui_moveCall issue in SUIJson `<a>` shows as text

## Ashok questions

- Generics!!!
- sui::object::{Self, UID} we get UID but also get all object to later call object::new(ctx) question is: Why not do sui::object::{new, UID} -- last slide
- Why is recursion so restricted?
- Witness: A witness is attesting that a certain object is unique? (A witness attests uniqueness?)




## Sui onboarding issues

- Assumes people know Rust, I think there should be a separate detailed explanation of types, just like Rust has one
- A fair assumption is that people know what a reference is, but I still think that the whole idea of ownership should be explained in depth with examples.
- To the above points, the viewpoint should be "Move is a self-standing programming language and it needs its documentation just like any other programming language" (instead of: "Move is similar to Rust, get the basics from there and then come back).
- JSON RPC should be more verbose with an example for each call
- JSON RPC error messaging is very poor which bubbles up to the sdk
-JSON RPC feels a bit semantically incorect, eg: gas instead of gas_id

