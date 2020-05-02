
function Assert (values, message) {
    var element = document.createElement('span');
    if (values.some(e => !e)) {
        element.classList.add('red');
        element.innerHTML =  'Failed: ' + message;
        console.error('\x1b[31m%s\x1b[0m', 'Failed:', message);
    } else {
        element.classList.add('green');
        element.innerHTML =  'Success: ' + message;
        console.info('\x1b[34m%s\x1b[0m', 'Success:', message)
    }
    document.querySelector('#logs').append(element);
};

function DataDemo () {
    const object = new DeepObject();
    object.level1.level2.level3.level4 = 4;
    object.level1.level2.level3.level4.level5.level6;
    object.level1.level2.level3.level4.level5.level6.level7 = 7;
    const tests  = [
        object.level1.level2.level3.level4 == 4,
        object.level1.level2.level3.level4.level5.level6.level7 == 7,
    ]
    return [tests, object];
};

function Test (fun) {
    try {
        fun.apply(this, DataDemo());
    } catch (error) {
        Assert([false], error);
    }
};

Test(function (defaultTests, dummy) {
    // Test if setting values to upper levels breaks the chain.
    dummy.level8.level9 = 'last';
    defaultTests.push(dummy.level8.level9 == 'last');
    Assert (defaultTests, 'Nested elements, upper levels.');
});

Test(function (defaultTests, dummy) {
    // Tests if setting values in between, breaks the chain.
    dummy.level1.level2.level3.level4.level5 = 5;
    defaultTests.push(dummy.level1.level2.level3.level4.level5 == 5);
    Assert (defaultTests, 'Nested element, in between levels.');
});

Test(function (defaultTests, dummy) {
    // Tests if setting values in lower levels, breaks the chain.
    dummy.level1 = 1;
    defaultTests.push(dummy.level1 == 1);
    Assert (defaultTests, 'Nested element, Lower levels.');
});

Test(function (defaultTests, dummy) {
    // Tests if setting base value, breaks the chain.
    dummy.setValue('origen');
    defaultTests.push(dummy == 'origen');
    Assert (defaultTests, 'Reset value, keep al childs.');
});

Test(function (defaultTests, dummy) {
    // Tests if adding a new path, breaks the chain.
    dummy.level1.level2.level3.level4.level4Variant.levelExtra = Infinity;
    defaultTests.push(dummy.level1.level2.level3.level4.level4Variant.levelExtra == Infinity)
    Assert (defaultTests, 'Adding a new path, keep al childs.');
});

Test(function (defaultTests) {
    // Test numeric sum.
    var one = DeepObject(1), two = DeepObject(2);
    defaultTests.push(one + two == 3);
    Assert (defaultTests, 'Behavior: Numeric sum.');
});

Test(function (defaultTests) {
    // Test numeric substraction.
    var one = DeepObject(1), two = DeepObject(2);
    defaultTests.push(one - two == -1);
    Assert (defaultTests, 'Behavior: Numeric substraction.');
});

Test(function (defaultTests) {
    // Test numeric multiplication.
    var one = DeepObject(1), two = DeepObject(2);
    defaultTests.push(one * two == 2);
    Assert (defaultTests, 'Behavior: Numeric multiplication.');
});

Test(function (defaultTests) {
    // Test numeric division.
    var one = DeepObject(1), two = DeepObject(2);
    defaultTests.push(one / two  == .5);
    Assert (defaultTests, 'Behavior: Numeric division.');
});

Test(function (defaultTests) {
    // Test numeric strict equality
    var one = DeepObject(1);
    defaultTests.push(
        one.valueOf() === 1,
        one == 1
    );
    Assert (defaultTests, 'Behavior: Numeric strict equality.');
});

Test(function (defaultTests) {
    // Test different data types.
    var one = DeepObject(1), string = DeepObject('uno');
    defaultTests.push(one + string === '1uno');
    Assert (defaultTests, 'Behavior: Mixing different data types.');
});

Test(function (defaultTests) {
    // Test different data types.
    var uno = DeepObject('uno');
    uno.unopuntodos = '1.2';
    defaultTests.push(
        uno.toUpperCase() === 'UNO',
        uno.unopuntodos == '1.2',
    );
    Assert (defaultTests, 'Behavior: Native string base methods.');
});


Test(function (defaultTests) {
    // Test different data types.
    var uno = DeepObject(1);
    uno.dos.infinito = Infinity;
    defaultTests.push(
        uno.toFixed(2) === '1.00',
        uno.dos.infinito == Infinity,
    );
    Assert (defaultTests, 'Behavior: Native integer base methods.');
});


Test(function (defaultTests) {
    // Test different data types.
    var falsy = DeepObject(false);
    var truly = DeepObject(true);
    defaultTests.push(
        falsy == false,
        truly == true,
    );
    Assert (defaultTests, 'Initialization: Boolean.');
});


Test(function (defaultTests) {
    // Test different data types.
    var hola = DeepObject('hola');
    var adios = DeepObject('adios');
    defaultTests.push(
        hola == 'hola',
        adios == 'adios',
    );
    Assert (defaultTests, 'Initialization: String.');
});

Test(function (defaultTests) {
    // Test initial object reference and extending it.
    var withDefaults = DeepObject({
        height: 10,
        data: {
            reference: 1001,
            location: {
                locale: 'es-MX',
            },
        },
    });
    withDefaults.data.location.locale.newExt.otherData.ColimaCity.Colimita = 'Ticus';
    defaultTests.push(
        withDefaults.height == 10,
        withDefaults.data.reference == 1001,
        withDefaults.data.location.locale.newExt.otherData.ColimaCity.Colimita == 'Ticus',
        withDefaults.data.location.locale == 'es-MX',
    )
    Assert (defaultTests, 'Initialization: With default data.');
});

Test(function (defaultTests) {
    // Test if a literal object can be set.
    var obj = DeepObject();
    obj.data.data2 = { beer: 'Piedra Lisa.' };
    defaultTests.push(
        obj.data.data2.beer == 'Piedra Lisa.',
    )
    Assert (defaultTests, 'Override: object set as default value.');
});

Test(function (defaultTests) {
    // Test the literal object representation for a `Deep Object`.
    var obj = DeepObject();

    // Deep property search, also defines its literal.
    obj.prop1.prop2.prop3;
    obj.level1.level2.level3.dificulty = 10;

    obj.level1.extra = {
        reward: 'coin',
    };

    var literal = obj.getLiteral();

    defaultTests.push(
        literal.prop1.prop2.prop3.value == undefined,
        literal.level1.extra.reward.value == 'coin',
        literal.level1.level2.level3.dificulty.value == 10,
    );

    Assert (defaultTests, 'Utils: Object literal representation for infinite objects.');
});
