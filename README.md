Чем руководствуемся:
    Мы пишем в kebab-case: eto-vot-kebab-case.ts
    Компоненты пишем с большой буквы
    Вложенность в директориях стараемся делать не большой. Рекомендуемо:  < 4 уровней
    D.R.Y. - Dont repeat yourself. Не повторяй код, который уже был написан, переиспользуй его. Заключи в функцию и тд, чтобы переиспользовать в других разделах
    Не оставляем (console.log, комментарии), твой код должен быть ясен без комментария
    Для дебага быстрее использовать console.log, а не debugger
    Удаляй код, который закомментирован, удаляй не используемое
    Не делай большое полотно кода, разделяй на модули. Стили выписывай в отдельный файл
    Компоненты, в которых представлен, и визуал, и множество логики не рекомендуемы - разделяй их!
    Используй линтеры и стилизацию для кода, твой IDE это инструмент профессионала, настрой его под проект и себя самого
    Гугл это также сильный инструмент разработчика, не забывай его использовать
    Если у тебя возникли сложности, то обратись к старшему, это улучшит вас обоих
    Совершать ошибки это нормально, главное не замалчивай о них
    Ты часть команды, не забывай об этом. Над проектом работают еще люди, не забывай коммуницировать с ними и советоваться когда это необходимо
    Учись самостоятельности

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
