## Purpose
*localbooru* is intended to act as a local-network solution for sharing 
and hosting images between devices, i.e. iOS and Windows. The goal is to 
implement this using a typical anime media site UI.

Mostly, this was an excuse to try out Go for backend and Next for 
frontend--with a conscious effort to stay within the standard Go and Next
libraries. TL note; no npm installs during dev!

## Requirements
Node 20.12.0 or comparable

Golang 1.23.5 or comparable

## Setup
1. Clone repository
2. npm install in frontend
3. npm run dev in localbooru/
4. go run . in localbooru-be/