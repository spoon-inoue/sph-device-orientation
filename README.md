# About
流体シミュレーション - 粒子法 - SPH（Smoothed Particle Hydrodynamics）のwebgl実装。  
グリッドハッシュによる近傍探索の実装はしていない。

# Reference
- [Coding Adventure: Simulating Fluids](https://youtu.be/rSKMYc1CQHE?si=Ul6EgEpIs1xhE5sM)  
  この動画を見て、ソースコードをwebglに置き換えて、ほぼそのまま動いた。
  - [code](https://github.com/SebLague/Fluid-Sim/tree/Episode-01)
  - [Particle-Based Fluid Simulation for Interactive Applications](https://matthias-research.github.io/pages/publications/sca03.pdf)

- [粒子法入門 流体シミュレーションの基礎から並列計算と可視化まで C/C++ソースコード付](https://amzn.asia/d/2iBlekR)  
  SPHの概要を理解するには、こちらの書籍が参考になった。ただし、この書籍で扱っているのは、とても短いタイムステップでのシミュレーション（おそらく解析用のSPH）で、リアルタイムシミュレーションではないと思われるので注意が必要。
