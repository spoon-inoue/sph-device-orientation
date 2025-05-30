float DensityKernel(float particleDistance, float smoothingRadius) {
  if(particleDistance < smoothingRadius) {
    float v = smoothingRadius - particleDistance;
    return C5_SPIKY2 * v * v;
  }
  return 0.;
}

float NearDensityKernel(float particleDistance, float smoothingRadius) {
  if(particleDistance < smoothingRadius) {
    float v = smoothingRadius - particleDistance;
    return C3_SPIKY * v * v * v;
  }
  return 0.;
}

float PressureDerivativeKernel(float particleDistance, float smoothingRadius) {
  if(particleDistance <= smoothingRadius) {
    float v = smoothingRadius - particleDistance;
    return C6_SPIKY2_D1 * v;
  }
  return 0.;
}

float NearPressureDerivativeKernel(float particleDistance, float smoothingRadius) {
  if(particleDistance <= smoothingRadius) {
    float v = smoothingRadius - particleDistance;
    return C4_SPIKY_D1 * v * v;
  }
  return 0.;
}

float ViscosityKernel(float particleDistance, float smoothingRadius) {
  if(particleDistance < smoothingRadius) {
    float h2 = smoothingRadius * smoothingRadius, r2 = particleDistance * particleDistance;
    return C2_STD_D2 * (h2 - 5. * r2) * (h2 - r2);
  }
  return 0.;
}

// float ViscosityKernel(float particleDistance, float smoothingRadius) {
//   if(particleDistance < smoothingRadius) {
//     float v = smoothingRadius * smoothingRadius - particleDistance * particleDistance;
//     return C1_STD * v * v * v;
//   }
//   return 0.;
// }







