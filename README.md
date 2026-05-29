# Shhhcret React Native

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```
EXPO_PUBLIC_API_BASE_URL=https://shhhcret-api.up.railway.app
```

### 3. 앱 실행

> **중요:** 이 프로젝트는 카카오 네이티브 SDK를 사용하기 때문에 **Expo Go 앱으로 실행할 수 없습니다.**
> 반드시 아래 방법으로 실행해야 합니다.

---

#### Android

**사전 준비:**
- [Android Studio](https://developer.android.com/studio) 설치
- Android Studio에서 가상 기기(AVD) 하나 생성해두기 (Pixel 계열 추천)

**실행:**

```bash
# 가상 기기 또는 연결된 실제 기기에서 실행
npm run android
```

처음 실행 시 빌드에 5~10분 걸립니다. 이후 실행부터는 빠릅니다.

---

#### iOS (Mac 전용)

**사전 준비:**
- Xcode 설치 (App Store)
- Xcode 설치 후 아래 명령어로 CocoaPods 설치:

```bash
sudo gem install cocoapods
```

**실행:**

```bash
npm run ios
```

처음 실행 시 빌드에 5~10분 걸립니다. 이후 실행부터는 빠릅니다.

---

#### 코드 수정 후 바로 반영

앱이 실행 중인 상태에서 코드를 수정하면 자동으로 반영됩니다 (Fast Refresh).  
반영이 안 될 때는 앱에서 **두 손가락으로 흔들기** → 개발자 메뉴 → **Reload** 선택.

---

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
