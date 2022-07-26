![Seule Logo](https://raw.githubusercontent.com/ElMehdiLebbar/SeuleJs/master/s-lg.png)

# 🔱 Introduction:
🔰 Seule is a light-weight (19.3KB), blazing fast and feature-rich Javascript Framework. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers 🧙‍♂.

<br>

# 👑 Getting Started

You can create an index.html file and include Seule with:

# Installation

```javascript
npm i seule --save
```

🔹 At the core of Seule.js is a system that enables us to declaratively render data to the DOM using straightforward template syntax:

```html
<div id='app'>
    {{message}}
</div>
```

```javascript
import {Instance} from "seule";

new Instance({
  el: '#app',
  data: {
    message : 'hello Seule'
  }
})
```

### [▶️ Quick Start ](https://github.com/ElMehdiLebbar/Seule-Hello-Word)

We have already created Hello World Seule app! Click on the "Quick Start" 👆 button to see how it works.

<br>

## ↩️ Styling Apps in Seule  

Seule uses Shadow DOM, It allows us to ship self contained components along with their style and isolate the component from global style while "protecting" the host application from styles defined inside the component. 

### Two Ways to Insert CSS

there are two ways of inserting a style sheet:

* Using _Css Method
* Adding Style property (only for components)

#### _Css Method

To use _Css Method, it should be included from the Model Module.

#### 🔹 for exemple:

```html
<div id='app'></div>
```

```javascript
import css from "./assets/css/app.css";

import {Instance} from "seule";
import {_Css} from "seule/model";

new Instance({
  el: '#app',
  data: {
    message : 'hello Seule'
  },
  async handlers($app){
      _Css(css, $app);
  }
})
```

To use _Css Method, it should be included from the Model Module.

#### Adding Style property

🔹 you can add css to your application just by passing it into the style property.

```javascript
import css from "./assets/css/app.css";

import {Instance} from "seule";

const app = new Seule({
  el: '#app',
  style: css, 
  data:{
    message: "Hello World"    
  }
})
```    
    
<br>

## ↩️ Bind element attributes 

In addition to text interpolation, we can also bind **element attributes** like this:

#### 〽️ Syntax:

```html
<element data-attribute="[attribute: <String>]:[variable: <String>]"></element>
```

#### 🔹 for exemple:

```html
<div id='app'>
    <p data-attribute="title:message"> Hover your mouse over me <br> for a few seconds </p>
</div>
```

```javascript
import {Instance} from "seule";

new Instance({
  el: '#app',
  data: {
    message : 'You visited this page on ' + new Date().toLocaleString()
  }
})
```

<br>

## ↩️ Handling User Input


Magic Happens here by invoking Methods inside the handlers(), using one parameter $app and let users interact with your app

#### 🔹 for exemple:

```html
<div id='app'>
    <p>{{message}}</p>
    <button>click-me</button>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";

new Instance({
  el: '#app',
  data:{message: "Hello my Friend"},
  async handlers($app){
    const scope = Scope($app);

    scope.Native(e=>{
      const btn = e.querySelector("button");
      btn.addEventListener("click", ()=>
              $app.data.message = $app.data.message.split('').reverse().join(''));
    });
  }
});
```

<br>

## ↩️ Selectors

For more security, Seule uses Shadow DOM. The problem in that, is you can't get access to the DOM element(s) directly unless you use Css selectors inside the handlers() by invoking the Scoop Method.

Scope Method can accept one argument.

Scope Method has a function call Select returns all elements in the Seule app that matches a specified CSS selector(s), as a static Seule Object.


#### 〽️ Syntax

```javascript
Scope([Seule_component])
```

#### 〽️ Select Function Syntax

```javascript
Scope([Seule_component]).Select([CSS_selectors])
```

Parameter --> CSS selectors

Type --> String

Tip: For a list of all CSS Selectors, look at w3schools [!CSS Selectors Reference](https://www.w3schools.com/cssref/css_selectors.asp)


#### Example

🔹 You can select all &lt;p&gt elements on app like this:

```javascript
Scope($app).Select("p")
```

When a user clicks on a button, all &lt;p&gt; elements will be hidden:
    
```html
<div id='app'>
    <p>{{message}} 1</p>
    <p>{{message}} 2</p>
    <p>{{message}} 3</p>
    <button title="{{title}}">Hide All!</button>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";
import {Effects} from "seule/effects";
import {Events} from "seule/events";

new Instance({
  el: '#app',
  data:{message: "Hello my Friend"},
  async handlers($app){
    Effects();
    Events();

    const
            scope = Scope($app),
            btn = scope.Select("button"),
            p = scope.Select("p");

    btn.Click(()=> p.Hide());
  }
});
```    

<br>


## ↩️ Events

> What is an Event?

An event represents the precise moment when something happens. Examples:

- moving a mouse over an element
- selecting a radio button
- clicking on an element

for mor details about [!Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)

#### 〽️ Syntax

using the **On** Method to assign an event to an element. 

```javascript
Select([CSS selectors]).On([event:<String>], [handler:<Function>])
```

#### Example

🔹 for exemple To assign a click event to all button on a Seule app, you can do this:

```html
<div id='app'>

    <img src="https://bit.ly/3mA0FbG" width="150">

    <button>Change the picture</button>

    <p>{{message}}</p>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";
import {Events} from "seule/events";

new Instance({
  el: '#app',
  data:{
    message: "Click the button to see what happens!",
    source: "https://bit.ly/3mA0FbG"
  },
  async handlers($app){
    Events();

    const
            scope = Scope($app),
            btn = scope.Select("button");

    btn.On("click",()=> $app.data.source = "https://bit.ly/3Jb61VN");  }
});
```

<br>

## ↩️ Special Events

### 🔰 Click()

The function is executed when the user clicks on the HTML element. 

🔹 For example When a click event fires on an element show an alert box.

```javascript
Select("button")
    .Click(()=> alert('just a simple click'))
```


### 🔰 Hold()

The function is executed when the user make a long presse on the HTML element.

#### 〽️ Syntax

```javascript
Select([CSS selectors]).Hold([handler:<Function>], [time:<Integer>])
```

the time by default is 1500 => 1.5s

#### Example

🔹 Show an alert box When user make a long presse on button for 3s.

```html
<div id='app'>
    <button>Hold Me for 3s</button>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";
import {Events} from "seule/events";

new Instance({
  el: '#app',
  data:{
    message: "Click the button to see what happens!",
    source: "https://bit.ly/3mA0FbG"
  },
  async handlers($app){
    Events();

    const
            scope = Scope($app),
            btn = scope.Select("button");

    btn.Hold(()=> alert('Good Job!™ 🤩'), 1000);
  }
});

```

### 🔰 Swipe()

Detecting a swipe (left, right, top or down) When a swipe event fires on an element.

#### 〽️ Syntax

```javascript
Select([CSS selectors]).Swipe([event:<String>], [handler:<Function>])
```

#### Events

- left
- right
- top
- bottom

#### Example

🔹 Change the background When user swipe left 🤚 on screen

```html
<div id='app'>
    <p data-attribute="title:tooltip">{{message}}</p>
</div>
```

```javascript
import {Instance} from "seule";
import {Hoisting} from "seule/selectors";
import {Events} from "seule/events";
import {Effects} from "seule/effects";

new Instance({
  el: '#app',
  data:{
    message: "Swipe left to see what happens!",
    tooltip : "See this demo on Mobile"
  },
  async handlers($app){
    Events();
    Effects();

    const body = Hoisting("body");

    body.Swipe("left", e=> e
            .Css('background')
            .set = '#fed000');
  }
});
```

### 🔰 Focus()

The focus event occurs when an element gets focus (when selected by a mouse click or by "tab-navigating" to it).

The Focus() method triggers the focus event, or attaches a function to run when a focus event occurs.

#### 〽️ Syntax

Trigger the focus event for selected elements:

```javascript
Select([CSS selectors]).Focus()
```

Attach a function to the focus event:

```javascript
Select([CSS selectors]).Focus([handler:<Function>])
```
#### Example

🔹 Attach a function to the focus event. The focus event occurs when the <input> field gets focus:

```html
<div id='app'>
    <input placeholder="Focus on me!" type="text">
    <p>{{message}}</p>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";
import {Events} from "seule/events";
import {HtmlMethods} from "seule/htmlMethods";

new Instance({
    el: '#app',
    data: {
        message: "Click in the input field to see what happens!"
    },
    async handlers($app){
        Events();
        HtmlMethods();

        const
            scope = Scope($app),
            input = scope.Select("input");

        input
            .Focus(e =>
                e.Val().set = "Great work keep it up!");

    }
})
```

### 🔰 Blur()

The blur event occurs when an element loses focus.

The Blur() method triggers the blur event, or attaches a function to run when a blur event occurs.

#### 〽️ Syntax

Trigger the blur event for the selected elements:

```javascript
Select([CSS selectors]).Blur()
```

Attach a function to the focus event:

```javascript
Select([CSS selectors]).Blur([handler:<Function>])
```
#### Example

🔹 Attach a function to the blur event. The blur event occurs when the <input> field loses focus:

```html
<div id='app'>
    <input placeholder="Write something!" type="text">
    <p>{{message}}</p>
</div>
```

```javascript
import {Instance} from "seule";
import {Scope} from "seule/selectors";
import {Events} from "seule/events";
import {HtmlMethods} from "seule/htmlMethods";

new Instance({
    el: '#app',
    data: {
        message: "Click outside the field to lose focus (blur)."
    },
    async handlers($app){
        Events();
        HtmlMethods();

        const
            scope = Scope($app),
            input = scope.Select("input"),
            p = scope.Select("p");

        input
            .Blur(() =>
                p.Text().set = "This input field has lost its focus!");

    }
});
```

## ↩️ Handling keyboard Events

### 🔰 HotKey()

With HotKey Method in Seule you can now handling keyboard shortcuts easly. 

#### 〽️ Syntax

```javascript
Select([CSS selectors]).Hotkey([keys:<String>], [handler:<Function>], [prevent:<Boolean>]);
```

### SUPPORTED KEYS:

For modifier keys you can use  <code>shift</code>, <code>ctrl</code>, <code>alt</code> or <code>meta</code>

You can substitute  <code>option</code> for <code>alt</code> and <code>command</code> for <code>meta</code>

Other special keys are <code>backspace</code>, <code>tab</code>, <code>enter</code>, <code>return</code>, <code>capslock</code>, <code>esc</code>, <code>escape</code>, <code>space</code>, <code>pageup</code>, <code>pagedown</code>, <code>end</code>, <code>home</code>, <code>left</code>, <code>up</code>, <code>right</code>, <code>down</code>, <code>ins</code>, <code>del</code>, and <code>plus</code>

Any other key you should be able to reference by name like <code>a</code>, <code>/</code>, <code>$</code>, <code>*</code>, or <code>=</code>.

#### Examples

🔹 Hotkey event with Single key:

```javascript
Select('input').HotKey('m',
    ()=> alert('M button is pressed on the Keyboard!'));
```

🔹 Combination of keys:

```javascript
Select('input').HotKey('ctrl s',
    ()=> alert('You pressed ctrl+s!'));
```

🔹 Sequence of keys like Konami Style (:

```javascript
Select('input').HotKey('Left Right Left Right A C',
    ()=> alert('Now you can play with Orochi Iori'));
```

🔹 Or you can specify keyboard events that will work anywhere including inside textarea/input fields like:

```javascript
import {Instance} from "seule";
import {Hoisting} from "seule/selectors";
import {Events} from "seule/events"


new Instance({
    el: '#app',
    data: {
        message: "Click outside the field to lose focus (blur)."
    },
    async handlers(){
        Events();

        const
            wn = Hoisting("body");

        wn.HotKey('ctrl r',
            ()=> alert('Global keyboard shortcuts'));

// if you want prevent the default refresh event under WINDOWS system
        wn.HotKey('ctrl r',
            ()=> alert('Global keyboard shortcuts'), true);

    }
});    
```

