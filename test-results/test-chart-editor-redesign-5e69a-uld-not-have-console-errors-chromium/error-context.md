# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - heading "500" [level=1] [ref=e6]
    - paragraph [ref=e7]: "Failed to fetch dynamically imported module: http://localhost:3000/visual-communication-app/assets/pages/chart.vue"
  - generic:
    - img
  - generic [ref=e8]:
    - button "Toggle Nuxt DevTools" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
    - generic "App load time" [ref=e13]:
      - generic [ref=e14]: "4"
      - generic [ref=e15]: s
    - button "Toggle Component Inspector" [ref=e17] [cursor=pointer]:
      - img [ref=e18]
  - generic [ref=e24]:
    - generic [ref=e25]: "[plugin:vite:vue] Error parsing JavaScript expression: Unterminated string constant. (1:62)"
    - generic [ref=e26]: C:/Users/papar/Documents/repositories/visual-communication-app/components/TextFormattingToolbar.vue:79:24
    - generic [ref=e27]: "77 | class=\"color-button\" 78 | @click=\"toggleBgColorPicker\" 79 | :aria-label=\"'Background color: ' + (formatting.backgroundColor || 'none')'\" | ^ 80 | :style=\"{ backgroundColor: formatting.backgroundColor || '#ffffff' }\" 81 | >"
    - generic [ref=e28]: at createCompilerError (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1378:17) at emitError (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3014:5) at createExp (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3007:7) at Object.onattribend (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:2532:29) at Tokenizer.handleInAttrValue (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:959:16) at Tokenizer.stateInAttrValueDoubleQuotes (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:969:10) at Tokenizer.parse (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1113:16) at Object.baseParse (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:3053:13) at Object.parse (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-dom\dist\compiler-dom.cjs.js:910:23) at Object.parse$1 [as parse] (C:\Users\papar\Documents\repositories\visual-communication-app\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:1824:24)
    - generic [ref=e29]:
      - text: Click outside, press Esc key, or fix the code to dismiss.
      - text: You can also disable this overlay by setting
      - code [ref=e30]: server.hmr.overlay
      - text: to
      - code [ref=e31]: "false"
      - text: in
      - code [ref=e32]: vite.config.js
      - text: .
```