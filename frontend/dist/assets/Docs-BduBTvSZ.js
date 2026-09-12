import{j as e,u as n,r as c}from"./index-Bdc5hhzE.js";import{P as l}from"./PageHeader-b4WteemL.js";import{C as r}from"./Card-BAEt8Wll.js";import{a as o}from"./CodeBlock-M1d9KQS0.js";function p({tabs:s,active:t,onChange:i}){return e.jsx("nav",{className:"tabs",role:"tablist","aria-label":"tabs",children:s.map(a=>e.jsxs("button",{type:"button",role:"tab","aria-selected":t===a.id,className:`tab ${t===a.id?"tab-active":""}`,onClick:()=>i(a.id),children:[a.label,a.badge?e.jsx("span",{className:"badge badge-secure",style:{marginInlineStart:6},children:a.badge}):null]},a.id))})}const d=`Cryptography & Information Security Course Simulator
================================================
Stack
-----  Frontend : React 18 + TypeScript + Vite
         Backend : FastAPI (Python 3.13) + uvicorn
         Testing : pytest (backend) · tsc/vitest (frontend)

Backend layout
--------------
  app/
    algorithms/  23 real implementations (caesar…blake3)
    services/    algorithm_service, math_service,
                 exercise_service, quiz_service
    api/routes/  REST endpoints under /api
    core/        config, logging, security
    utils/       math_utils, steps engine, errors
  tests/         algorithm vectors + API + lifecycle

Frontend layout
---------------
  src/
    pages/        dashboard, algorithm, theory, compare,
                  playground, exercises, quizzes, math, docs
    components/   ui/ (design system), simulator/
    data/         static algorithm catalog
    i18n/         en + ar dictionaries (RTL support)
    services/     REST client for the backend
    styles/       design tokens and component styles

REST API (all algorithms are executed on the backend)
-----------------------------------------------------
  GET  /api/health
  GET  /api/algorithms
  GET  /api/algorithms/{id}
  POST /api/algorithms/execute     {algorithm, operation, inputs}
  POST /api/math/{tool}            number-theory laboratory
  GET  /api/exercises              practice problems
  POST /api/exercises/{id}/check
  GET  /api/quizzes/questions
  POST /api/quizzes/check          answers = {qid: optionText}`,u=`POST /api/algorithms/execute
Content-Type: application/json

{
  "algorithm": "caesar",
  "operation": "encrypt",
  "inputs": { "text": "HELLO", "shift": 3 }
}

→ 200 OK
{
  "algorithm": "caesar",
  "operation": "encrypt",
  "input": "HELLO",
  "result": "KHOOR",
  "extra": { ... },
  "steps": [
    { "step": 1, "title": "Map letters",
      "description": "...",
      "input": "HELLO", "output": "KHOOR",
      "detail": { ... } },
    ...
  ]
}`;function b(){const{t:s}=n(),[t,i]=c.useState("architecture");return e.jsxs("div",{className:"animate-fade-up",children:[e.jsx(l,{title:s("nav.documentation"),subtitle:s("docs.subtitle"),actions:void 0}),e.jsx(p,{tabs:[{id:"architecture",label:"Architecture"},{id:"api",label:"API Reference"},{id:"curl",label:"curl Examples"}],active:t,onChange:i}),t==="architecture"&&e.jsx(r,{children:e.jsx(o,{children:d})}),t==="api"&&e.jsxs(r,{children:[e.jsxs("div",{className:"card-sub",style:{marginBottom:12},children:[s("docs.apiDocs"),":"," ",e.jsx("a",{href:"http://127.0.0.1:8000/docs",target:"_blank",rel:"noreferrer",children:"http://127.0.0.1:8000/docs"})]}),e.jsx(o,{children:u})]}),t==="curl"&&e.jsx(r,{children:e.jsx(o,{children:`# Health
curl http://127.0.0.1:8000/api/health

# Encrypt with Caesar
curl -X POST http://127.0.0.1:8000/api/algorithms/execute \\
  -H "Content-Type: application/json" \\
  -d '{"algorithm":"caesar","operation":"encrypt","inputs":{"text":"HELLO","shift":3}}'

# Modular inverse
curl -X POST http://127.0.0.1:8000/api/math/modular-inverse \\
  -H "Content-Type: application/json" \\
  -d '{"a":3,"modulus":11}'`})})]})}export{b as Docs};
