# [2.0.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.7.0...v2.0.0) (2025-11-18)


### Bug Fixes

* **changelog:** escape asterisk in regex pattern ([0e9876c](https://github.com/bertrandgressier/adventure-tome/commit/0e9876c22400af1978213af0694a3e1e81046e80))
* **ci:** remove --from-stdin flag for commitlint v20 ([e896c7a](https://github.com/bertrandgressier/adventure-tome/commit/e896c7a760a996d6a301e22021ae8c9c01dcfbc7))
* **ci:** use .mjs extension for ESM script ([f705064](https://github.com/bertrandgressier/adventure-tome/commit/f7050645439fe665813225e1f7267a04fc14b597))
* **ci:** use pnpm exec commitlint from package.json deps ([f60df99](https://github.com/bertrandgressier/adventure-tome/commit/f60df990f946a8bbec809ca05972d5f7b6b5c15d))
* **lint:** convert changelog script to ESM ([ca6c41a](https://github.com/bertrandgressier/adventure-tome/commit/ca6c41a65bfc292a7243fbeb92ecc27e7240e247))
* **navigation:** move router.push to useEffect to avoid setState during render ([bcebbaf](https://github.com/bertrandgressier/adventure-tome/commit/bcebbafe04d2c8519ad85c16f5755ce5d3a7ec90))
* **store:** add hasInitialLoad flag to prevent race condition on page reload ([70ca17c](https://github.com/bertrandgressier/adventure-tome/commit/70ca17cd3baff2170e30a9936b39d5947972c0ee))


### Code Refactoring

* migrate lib/ to src/ for Clean Architecture consistency ([d71bdd5](https://github.com/bertrandgressier/adventure-tome/commit/d71bdd56cb1fa739ed16483c828d101bdd673172))
* reorganize project structure to follow Next.js best practices ([ab272ae](https://github.com/bertrandgressier/adventure-tome/commit/ab272ae16b66138df6f8288063487c31231fef5f))


### Features

* **application:** add character service with use cases ([6e29a57](https://github.com/bertrandgressier/adventure-tome/commit/6e29a57a0edbe52a08390d82e35a2e356024aba4))
* **domain:** implement clean architecture domain layer ([893dcc4](https://github.com/bertrandgressier/adventure-tome/commit/893dcc4ca35d17c80b4b8e2f17a8fe62e3d8fa51))
* implémentation de Zustand pour la gestion d'état centralisée ([40fc880](https://github.com/bertrandgressier/adventure-tome/commit/40fc880e6bad598d3ab412f98e0a088f88136c43))
* **infrastructure:** add IndexedDB repository adapter ([4663d88](https://github.com/bertrandgressier/adventure-tome/commit/4663d88127546cc391a6d448d45cb6d0cd8df814))
* **presentation:** add useCharacter hook and refactored components ([a682f88](https://github.com/bertrandgressier/adventure-tome/commit/a682f889bcc9b30e617a29357f0212d75738dee9))


### BREAKING CHANGES

* All lib/ imports now use @/src/* except @/lib/utils
* Component imports now use @/components instead of @/app/components
* **domain:** None - Data structure 100% compatible with existing IndexedDB schema

# [1.7.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.6.0...v1.7.0) (2025-11-17)


### Features

* affichage fantomatique des personnages morts et simplification popup défaite ([5f0927c](https://github.com/bertrandgressier/adventure-tome/commit/5f0927c4315b1cdf98b095de69fb6bb398568621)), closes [#3d1f1f](https://github.com/bertrandgressier/adventure-tome/issues/3d1f1f)
* ajout composant BookTag pour identifier les 3 livres de la saga ([013db6b](https://github.com/bertrandgressier/adventure-tome/commit/013db6ba8791bbb4a6b1b1d00e3373b32ead7021))

# [1.6.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.5.1...v1.6.0) (2025-11-14)


### Features

* ajout du lien de donation PayPal ([2f923ab](https://github.com/bertrandgressier/adventure-tome/commit/2f923abdcc65f81500d9d066978a03bf60db288a))

## [1.5.1](https://github.com/bertrandgressier/adventure-tome/compare/v1.5.0...v1.5.1) (2025-11-14)


### Bug Fixes

* retirer autoFocus du formulaire de combat pour mobile ([111370c](https://github.com/bertrandgressier/adventure-tome/commit/111370cf9b507bb78dbf8803e0d2a6d559872f80))

# [1.5.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.4.4...v1.5.0) (2025-11-14)


### Features

* **analytics:** add custom event tracking for user actions ([dfab43e](https://github.com/bertrandgressier/adventure-tome/commit/dfab43e6d12d974b557a72dc73b43fe9cfdb7175))

## [1.4.4](https://github.com/bertrandgressier/adventure-tome/compare/v1.4.3...v1.4.4) (2025-11-14)


### Bug Fixes

* **lint:** move localStorage read to useState initializer ([e589395](https://github.com/bertrandgressier/adventure-tome/commit/e5893957b5277612af7ae9de81658209563c793a))
* **music:** prevent incorrect playing state on first load ([0645dec](https://github.com/bertrandgressier/adventure-tome/commit/0645decad2b06bf687402a6ac5d27ca06a20040a))

## [1.4.3](https://github.com/bertrandgressier/adventure-tome/compare/v1.4.2...v1.4.3) (2025-11-14)


### Bug Fixes

* **analytics:** simplify Google Analytics implementation ([c2ea552](https://github.com/bertrandgressier/adventure-tome/commit/c2ea552e782cf95b7ea06a0868998a1b5b4a2523))
* **release:** preserve NEXT_PUBLIC_GA_ID in .env.production ([3f19568](https://github.com/bertrandgressier/adventure-tome/commit/3f19568b6006606705fcc3ca6298b338bd214e19))

## [1.4.2](https://github.com/bertrandgressier/adventure-tome/compare/v1.4.1...v1.4.2) (2025-11-14)


### Bug Fixes

* **ci:** make release depend on CI success ([ae8f748](https://github.com/bertrandgressier/adventure-tome/commit/ae8f7485df398c4e4ae9025a1c31ba5556fb66c0))
* wrap GoogleAnalytics in Suspense for useSearchParams ([aa458d0](https://github.com/bertrandgressier/adventure-tome/commit/aa458d06784cbf37941db34b945bc170780646ab))

## [1.4.1](https://github.com/bertrandgressier/adventure-tome/compare/v1.4.0...v1.4.1) (2025-11-14)


### Bug Fixes

* **analytics:** use NEXT_PUBLIC_GA_ID for proper client-side tracking ([76fda3c](https://github.com/bertrandgressier/adventure-tome/commit/76fda3cb20304f908fbb0b38cbb68490f8abce06))

# [1.4.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.3.1...v1.4.0) (2025-11-14)


### Bug Fixes

* **ci:** setup pnpm before setup-node cache ([f49cce2](https://github.com/bertrandgressier/adventure-tome/commit/f49cce271c359704e100ed15113951425cee4476))


### Features

* **ci:** add manual trigger for release workflow ([7587813](https://github.com/bertrandgressier/adventure-tome/commit/75878137bda74a49f7acfe8f47dd10504255845f))


### Performance Improvements

* optimize CI build caching ([b00b80d](https://github.com/bertrandgressier/adventure-tome/commit/b00b80deff82b3e2106bcebeaebfaa4a915a8cad))

## [1.3.1](https://github.com/bertrandgressier/adventure-tome/compare/v1.3.0...v1.3.1) (2025-11-14)


### Bug Fixes

* icône musique affichée correctement au démarrage ([bad15ab](https://github.com/bertrandgressier/adventure-tome/commit/bad15ab2a8363ba84e0f8bbf842eac34913f4d60))

# [1.3.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.2.0...v1.3.0) (2025-11-14)


### Bug Fixes

* génération correcte des tags Docker avec version ([d35f5c2](https://github.com/bertrandgressier/adventure-tome/commit/d35f5c2fa13e756cbc1a07d9ae866826e4fc5988))


### Features

* support Google Analytics avec injection runtime ([8dafaba](https://github.com/bertrandgressier/adventure-tome/commit/8dafaba3fe3f0b568d5e705afc827d31e864146c))

# [1.2.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.1.1...v1.2.0) (2025-11-14)


### Features

* ajout lien vers CHANGELOG depuis la version ([47ec98c](https://github.com/bertrandgressier/adventure-tome/commit/47ec98c52088dbebd9f60561fe9dba1f5c5bff30))
* release uniquement sur changements du code applicatif ([6079fcd](https://github.com/bertrandgressier/adventure-tome/commit/6079fcdde89e16ec016981f97452717f933f6df5))

## [1.1.1](https://github.com/bertrandgressier/adventure-tome/compare/v1.1.0...v1.1.1) (2025-11-14)


### Bug Fixes

* séparation des workflows release et docker ([f42b44c](https://github.com/bertrandgressier/adventure-tome/commit/f42b44c4221f3927f11d5be34be7c08a599560e2))

# [1.1.0](https://github.com/bertrandgressier/adventure-tome/compare/v1.0.0...v1.1.0) (2025-11-14)


### Bug Fixes

* correction des titres en double et nettoyage ([b881191](https://github.com/bertrandgressier/adventure-tome/commit/b8811919de7bc04af6fda0cfa7bfbee4e831f038))
* corrections UI et ESLint ([be085c1](https://github.com/bertrandgressier/adventure-tome/commit/be085c1eb2a145df8063b52261f6bfddf2575699))


### Features

* ajout liens GitHub et signalement de bugs ([0da26bb](https://github.com/bertrandgressier/adventure-tome/commit/0da26bb8c1625701ff0fb24caf793e4a452611ec))

# 1.0.0 (2025-11-13)


### Bug Fixes

* apply dark theme to InstallPrompt component ([4440d0f](https://github.com/bertrandgressier/adventure-hero/commit/4440d0fec7a2ba17fbf7230bdba9536f9b98d72f))
* correct collection name to 'La Saga Dadga' ([22c5496](https://github.com/bertrandgressier/adventure-hero/commit/22c5496674644fa07f00a53bbeb7d7329fe13dc4))
* improve button readability with bold font and larger text ([4dced03](https://github.com/bertrandgressier/adventure-hero/commit/4dced039321dd9b1140722ef6f95260af19fdfee))
* make button visible with proper background and border ([0049fc6](https://github.com/bertrandgressier/adventure-hero/commit/0049fc62a5cdd262b1d6ccc5fd13d28185974c17))
* recreate character creation page from scratch ([e2f30fa](https://github.com/bertrandgressier/adventure-hero/commit/e2f30fad55c3a7625343eefa8aea186a84cba5fc))
* remove duplicate code causing parsing error ([e1debb6](https://github.com/bertrandgressier/adventure-hero/commit/e1debb643765767b948388ad0ce73b68cf26a950))
* remove starting equipment (not in book rules) ([b90c121](https://github.com/bertrandgressier/adventure-hero/commit/b90c1218affcee8e37a2b55be5486d3d85daaf9f))
* use explicit golden color for button background ([45ae90c](https://github.com/bertrandgressier/adventure-hero/commit/45ae90ca4242608c99792a693f00c7ebefa1dd7a))
* use pure black text on golden button for maximum contrast ([961b836](https://github.com/bertrandgressier/adventure-hero/commit/961b836fc4a58af63a8259124219ccd24bd3a712))


### Features

* add character creation page with dice rolling ([58aadb0](https://github.com/bertrandgressier/adventure-hero/commit/58aadb0e3b35f3a94aa2a63576c7fdec9bfe485a))
* character creation with correct talents and stats rules + manual mode ([657d94a](https://github.com/bertrandgressier/adventure-hero/commit/657d94a2a947ff2de59345fbbd771c25a8d41594))
* implement dark sepia theme with medieval styling ([4a6509b](https://github.com/bertrandgressier/adventure-hero/commit/4a6509b45e6718493dd4f630175bee5612a340a7)), closes [#1a140f](https://github.com/bertrandgressier/adventure-hero/issues/1a140f) [hi#contrast](https://github.com/hi/issues/contrast)
* improve character list presentation with better visibility ([bcd2795](https://github.com/bertrandgressier/adventure-hero/commit/bcd2795dcc1028f00c38a1f8609256702ebf59a9))
* IndexedDB storage for characters + display character list ([a463c0d](https://github.com/bertrandgressier/adventure-hero/commit/a463c0d4ee70189287828cfcdd215232f73a810e))
* mise en place semantic-release et CI/CD automatique ([4236270](https://github.com/bertrandgressier/adventure-hero/commit/42362707370125f0d2155a88aa40253b0f534b3b))
* update character creation with correct stats and talent selection ([c0fad1c](https://github.com/bertrandgressier/adventure-hero/commit/c0fad1cf412132a3336cb4c54a0655d8a5113f5a))
