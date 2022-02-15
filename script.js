'use strict';

//----------//
// BANK APP
//----------//
//חשבונות בבנק
const account1 = {
  owner: 'Ilay Asis',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2020-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2022-02-08T14:11:59.604Z',
    '2022-02-08T17:01:17.194Z',
    '2022-02-11T23:36:17.929Z',
    '2022-02-12T10:51:36.790Z',
  ],
  currency: 'ILS',
  locale: 'he-IL',
};

const account2 = {
  owner: 'Yoni Mor',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-01T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-02-12T14:43:26.374Z',
    '2022-02-13T18:49:59.371Z',
    '2022-02-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2,
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Ilay Asis',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////פונקציות המערכת

//פורמט הצגת תאריכים של העברות
const formatMovementDate = function (date, locale) {
  const CalcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = CalcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//כך נציג את מסך העברות.הפקדות
//הוספת האופצעה למיון המספרים ן
const displayMovments = (acc, sort = 0) => {
  containerMovements.innerHTML = '';
  // .textContent = 0
  //Used slice to not mutate the array
  const sortStates = [
    acc.movements,
    acc.movements.slice().sort((a, b) => a - b),
    acc.movements.slice().sort((a, b) => b - a),
  ];
  const movs = sortStates[sort];
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedfMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedfMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const displayMovments = function (acc, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const date = new Date(acc.movementsDates[i]);
//     const displayDate = formatMovementDate(date, acc.locale);

//     const formattedfMov = formatCur(mov, acc.locale, acc.currency);

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__date">${displayDate}</div>
//         <div class="movements__value">${formattedfMov}</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

//חישוב הכסף בחשבון
const calcDisplayBalacnce = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//חישוב כמה החשבון הכניס,כמה הוצאנו ו כמה קיבלנו עמלה מהבנק על זה שהפקדנו
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//ככה ניצור משם משתמש ארוך לרק שם ראשון של שם משפחה ושם פרטי
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserNames(accounts);

const updatUI = function (acc) {
  //ככה נראה הפקדות
  displayMovments(acc);

  //ככה נראה משיכות
  calcDisplayBalacnce(acc);

  //ככה נראה סיכום של החשבוו
  calcDisplaySummary(acc);
};

//שעון סופר אחורה לאחר התחברות
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    // בכל קריאה,יודפס
    labelTimer.textContent = `${min} : ${sec}`;

    //באפס שניות סגור את החשבון
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log In to get started`;
      containerApp.style.opacity = 0;
    }
    //--seconds
    time--;
  };
  //טיימר ל 5 דקות
  let time = 300;

  // קרא לטיימר כל שניה
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//התחברות למערכת

//fakealways loged in
// currentAccount = account1;
// updatUI(currentAccount);
// containerApp.style.opacity = 100;

//api dates

//day-month-year

//Event handlers
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  //ככה נמנע רענון מחדש של העמוד כמו שאמור להיות במצב דיפולט
  e.preventDefault();

  //שם משתמש
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //סיסמא
  if (currentAccount?.pin === +inputLoginPin.value) {
    //הודעת ברוך הבא
    labelWelcome.textContent = `Welcone back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // לאחר התחברות - כך ננקה את השדות של שם משתמש וסיסמה
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // //ככה נראה הפקדות
    // displayMovments(currentAccount.movements);

    // //ככה נראה משיכות
    // calcDisplayBalacnce(currentAccount);

    // //ככה נראה סיכום של החשבוו
    // calcDisplaySummary(currentAccount);

    //טיימר
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //update ui
    updatUI(currentAccount);
  }
});

//העברת כספים בין חשבונות
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update ui
    updatUI(currentAccount);

    // rest timer if u use the app
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  //בקשת הלוואה תאושר רק אם הסכום המבוקש הוא לפחות 10 אחוז מאחד העברות שבוצעו בחשבון
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //add mov
      currentAccount.movements.push(amount);

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //UPDATE ui
      updatUI(currentAccount);

      // rest timer if u use the app
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1200);
  }
  inputLoanAmount.value = '';
});

//סגירת חשבון
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //מחיקת חשבון
    accounts.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// כפתור מיוו
// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovments(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

let sorted = 1;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovments(currentAccount, sorted);
  console.log(sorted);
  sorted = sorted !== 2 ? ++sorted : 0;
});
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//map//

// const eurToUsd = 1.1;
// const movmentUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// const movmentsDescriptions = movments.map(
//   (mov, i) =>
//     `Movment ${i + 1} : You ${mov > 0 ? 'desposited' : 'withdrawal'} ${Math.abs(
//       mov
//     )}`
// );

// //arrow func//

// const movmentUSD = movements.map(mov => mov * eurToUsd);

// //for of loop //

// const movmentsUSDfor = [];
// for (const mov of movments) {
//   movments.push(mov * eurToUsd);
// }

//filter//

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(mov => mov < 0);

// //reduce//

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);

// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

/////
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

//find

// const account = accounts.find(acc => acc.owner === 'Ilay Asis');
// console.log(account);

//flat
// const allBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// //flatMpa
// const allBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

//arr
