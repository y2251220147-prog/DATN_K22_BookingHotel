// lib/faceapi-loader.ts
// Dùng chung cho cả FaceRegisterWidget và useFaceLogin
// Load model 1 lần duy nhất suốt session

let _instance: any = null;
let _loaded = false;
let _promise: Promise<any> | null = null;

export async function loadFaceApi() {
  if (typeof window === "undefined") {
    throw new Error("face-api chỉ chạy ở client");
  }

  // Cache hit — instant return
  if (_instance && _loaded) return _instance;

  // Đang load — tránh concurrent duplicate load
  if (_promise) return _promise;

  _promise = (async () => {
    const faceapi = await import("face-api.js");

    if (!_loaded) {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      _loaded = true;
    }

    _instance = faceapi;
    _promise = null;
    return faceapi;
  })();

  return _promise;
}
