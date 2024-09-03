---
author: rosie
pubDatetime: 2024-09-03T13:00:35Z
title: 브라우저를 노리는 공격, Cross Site Scripting
featured: false
draft: false
tags:
  - browser
description:
  Cross Site Scripting 공격과 브라우저가 어떻게 이 공격을 저지하는지 설명합니다.
---

이번 프로젝트 진행 했을 때, DOM 조작 기능이 있어서 해당 코드를 직접 실행 시키는 것에 대해 new Function이라는 문법을 알아보다 XSS(Cross Site Scripting) 공격에 매우 취약하다는 문제를 발견했었다.

그래서 이 브라우저를 겨냥한 공격과 어떻게 방지하는지에 대해 알아보고자 한다!

# 브라우저를 노리는 공격?

인터넷이 일반화되기 전에는 크랙이라고 하면 실행 파일 등에 감염된 컴퓨터 바이러스에 의한 것으로, 파괴 그 자체를 목적으로 했다. 브라우저가 많은 일을 해낼 수 있게 되면서 일상적으로 쇼핑을 하거나 이메일과 소셜 네트워크에서 개인 정보를 교환하게 되자, 컴퓨터가 아닌 브라우저를 표적으로 삼는 사례도 증가하게 되었다.

'브라우저를 노린다'고 했지만, 브라우저 자체의 취약점뿐만 아니라, 브라우저가 열람하는 서비스에서 보내는 HTML 및 자바스크립트 취약점도 공격 대상이 된다.

## Cross Site Scripting

Cross Site Scripting는 줄여서 XSS라고 하며 많은 공격의 기점이 되는 공격 방법이다. 사용자가 입력한 데이터를 제대로 검증하지 않고 웹 페이지에 그대로 삽입할 때 발생한다. 예를 들어, 웹사이트에 "이름을 입력해주세요"라는 텍스트 상자가 있다고 가정해보자. 사용자가 이름을 입력하면, 그 값이 다른 사용자도 볼 수 있도록 페이지에 표시된다. 만약 웹 서비스가 이 입력값을 아무런 검증 없이 그대로 HTML에 포함한다면, 공격자는 악성 스크립트를 이름 대신 입력할 수 있다.
```html
<input type="text" name="username" value="<script>alert('XSS 공격!')</script>">
```
위와 같이 입력되었다고 가정해보면, 이 입력값은 그대로 HTML에 포함되어, 페이지를 열람하는 사용자의 브라우저에서 <script>alert('XSS 공격!')</script>라는 자바스크립트 코드가 실행된다. 이로 인해 사용자에게 알림(alert)이 나타나지만, 더 심각한 경우 공격자는 쿠키를 탈취하거나 악성 코드를 삽입할 수 있다.

new Function을 사용할 때도 비슷한 문제가 발생할 수 있다.
```js
const userInput = "<script>alert('XSS!')</script>";
const maliciousFunction = new Function(userInput);
maliciousFunction(); // XSS 공격 가능
```
위 코드에서 new Function은 userInput을 자바스크립트 코드로 인식하고 그대로 실행한다. 결과적으로, 공격자는 userInput을 통해 악성 스크립트를 삽입하여 XSS 공격을 시도할 수 있다.

이렇게 투입된 스크립트가 쿠키에 엑세스 되면, 다른 서버로 전송되어 쿠키 정보가 유출된다. '로그인됨'이라는 세션 토큰을 도둑맞으면, 사용자 ID와 암호가 없어도 '로그인 상태'를 가로챌 수 있다. 또한 로그인 폼이 해킹되어 사용자가 입력한 정보를 다른 서버로 전송해버리거나 피싱 사이트로 전송되는 등 온갖 위험이 있다.

서버 측의 방어 방법에는 아래와 같은 방법이 있다.
1. 입력 검증 (Input Validation)
<br>
사용자가 입력한 내용을 그대로 HTML로 출력하는 일은 하지 말자. <br> 사용자 입력은 악의적인 입력이 들어올 것으로 보고 그대로 출력하지 않도록 해야 한다. <br> 입력 검증을 통하여 사용자 입력을 받을 때 예상된 형식인지 확인하자.

2. 출력 이스케이프 (Output Escaping)
<br>
HTML 특수 문자(예: <, >, &, ", ')를 그대로 출력하면 브라우저가 이를 HTML 태그나 속성으로 해석할 수 있다. 악의적인 사용자가 이를 이용해 스크립트를 삽입할 수 있어 보안 위험이 발생한다. 그렇기 때문에 HTML 특수 문자를 엔티티로 변환한다. 템플릿 엔진을 사용할 경우, 자동 이스케이프 기능을 활용한다.

3. HTTPOnly 속성 부여
<br>
이 속성을 부여하면 자바스크립트에서 액세스할 수 없는 쿠키가 된다. XSS 공격자는 자바스크립트를 사용한다. 자바스크립트에서 액세스할 수 없는 정보에는 접할 수 없기 때문에 자바스크립트에 의한 세션 토큰 누설의 위험을 줄일 수 있다.

4. X-XSS-Protection 헤더
<br>
X-XSS-Protection 헤더를 사용하면 HTML의 인라인에서 스크립트 태그를 사용하는 경우 등 수상한 패턴을 감지한다. X-가 붙은 비공식 헤더이지만, 인터넷 익스플로러, 크롬, 사파리 등의 브라우저가 지원하지만, 특정 버전 이상에서는 더 이상 지원하지 않는다고 한다.

<img width="810" alt="스크린샷 2024-09-03 오후 9 02 51" src="https://github.com/user-attachments/assets/e204c24b-4759-4b36-9c75-a105caf2c23f">

| X-XSS-Protection 헤더 설정 예시                                         |
| ---------------------------------------------------------- |
| X-XSS-Protection: 1; mode=block |

5. Content-Security-Policy 헤더
<br>
Content-Security-Policy 헤더는 웹사이트의 콘텐츠 보안 정책을 의미한다. 웹사이트에 필요한 기능을 서버에서 설정하여 XSS처럼 자바스크립트가 예상치 못한 동작하는 것을 방어한다.
또한 브라우저 환경에서는 헤더로 옵트인되지만, 크롬 OS 등에서 사용되는 크롬 앱은 Content-Security-Policy 지원이 필수로 되어있다.
HTML에서 로드하는 각종 리소스 파일의 사용 권한을 설정하는 디렉티브는 아래와 같다.

| 디렉티브       | 제한 대상                                        |
| -------------------- | ---------------------------------------------------------- |
| base-uri      | 도규먼트의 base URI(상대 경로의 시작점) |
| child-src  | Web Worker, `<frame>`, `<iframe>`으로 이용할 수 있는 URL |
| connect-src    | XMLHttpRequest, WebSocket, EventSource와 같은 자바스크립트로 연결할 출처 |
| font-src       | CSS의 @font-face에서 로드할 웹 글꼴 |
| frame-src       | `<frame>`, `<iframe>`이 로드될 수 있는 위치를 지정 |
| img-src | 이미지와 파비콘을 로드할 출처 |
| manifest-src     | 매니페스트를 로드할 출처 |
| media-src     | `<audio>`와 `<video>`를 제공하는 출처 |
| object-src     | 플래시나 자바 애플릿 등 기타 플러그인에 대한 제어 |
| script-src     | 자바스크립트를 로드할 출처 |
| style-src     | 읽기 가능한 스타일시트를 로드할 출처 |

위 디렉티브와 짝 지을 수 있는 속성은 아래와 같다.
| 데이터 속성       | 설명                                        |
| -------------------- | ---------------------------------------------------------- |
| none | 모든 출처를 허용하지 않는다. |
| self  | 같은 출처를 지정한다. |
| unsafe-inline  | 스크립트 및 인라인의 `<script>`태그, 이벤트 핸들러의 스크립트: 표기, 인라인의 `<style>`을 허가한다. 이름 그대로 XSS의 위험이 있다. |
| unsafe-eval | 문자열을 자바스크립트로서 실행하는 eval(), new Function(), setTimeout() 의 실행을 허가한다. 이것도 XSS의 위험이 있다. |
| data: | data의 URI를 허가한다. BASE64로 인코딩 된 이미지 파일의 문자열을 `<image>`태그의 소스로 설정하거나 CSS 텍스트에서 이미지 데이터를 삽입하여 이미지를 표시할 때 사용한다. |
| mediastream | mediastream:URI를 허가한다. HTML5 스트리밍에 사용한다. |
| blob: | blob:URI를 허가한다. |
| filesystem: | filesystem:URI를 허가한다. |

리소스 외에 일괄로 보안 설정을 해주는 디렉티브도 있다.
| 디렉티브       | 설명                                        |
| -------------------- | ---------------------------------------------------------- |
| default-src | 리소스의 액세스 범위 일괄 설정. 개별 설정이 우선된다. |
| sandbox | 팝업, 폼 등의 허용 설정. HTML의 `<iframe>`의 sandbox 속성과 같은 것을 지정한다. |
| upgrade-insecure-requests | HTTP 통신을 모두 HTTPS로 변경한다.  |

CSP에서 XSS 방지는 웹 애플리케이션에서 로드되고 실행될 수 있는 리소스를 제한함으로써 이루어진다. 아래와 같은 예시로 들 수 있다.

example.com이라는 웹사이트가 있다고 가정해보자. 이 사이트는 다음과 같은 CSP 헤더를 설정했다.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.com; style-src 'self' 'unsafe-inline'; img-src *; frame-src 'none'
```

1. `default-src 'self'`: 기본적으로 모든 리소스(스크립트, 이미지, 스타일 등)는 같은 출처(example.com)에서만 로드될 수 있다.

2. `script-src 'self' https://trusted.com`:
   - JavaScript는 example.com과 https://trusted.com 에서만 로드될 수 있다.
   - 이로 인해 `<script src="https://malicious.com/hack.js"></script>`와 같은 악성 스크립트 삽입이 차단된다.
   - 또한 `<script>alert('XSS');</script>`와 같은 인라인 스크립트도 실행되지 않는다.

3. `style-src 'self' 'unsafe-inline'`:
   - CSS는 example.com에서 로드되거나 인라인으로 작성될 수 있다.
   - 'unsafe-inline'은 XSS 위험을 증가시킬 수 있지만, 때로는 필요한 경우가 있다.

4. `img-src *`: 이미지는 모든 출처에서 로드될 수 있다.

5. `frame-src 'none'`:
   - 어떤 출처에서도 iframe을 사용할 수 없다.
   - 이는 `<iframe src="https://attacker.com/clickjack.html"></iframe>`와 같은 clickjacking 공격을 방지한다.


웹서비스 개발자가 주의해야 할 XSS 공격과 이를 방지할 수 있는 방법 5가지를 정리해봤다. XSS 외에도 중간자 공격, 세션 하이재킹 다양한 공격도 있는 것 같다. 이것도 추후에 정리 해보려고 한다.

---
참고 자료
- Real World HTTP : 시부카와 요시키