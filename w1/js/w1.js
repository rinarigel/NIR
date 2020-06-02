$(function () {

    let digitsValidator = function (e) {
        if (['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'].indexOf(e.code) !== -1) {
            if (e.target.value && parseInt(e.target.value) === 1) return e.code === 'Digit0';
            if (!e.target.value) return e.code !== 'Digit0';
        }
        return false;
    }, procentValidator = function (e, min, max) {
        const MIN = min || 0;
        const MAX = max || 1;
        const parsed = parseFloat(e.target.value)
        return e.target.value = Math.min(Math.max(parsed, MIN), MAX)
    };

    $(function () {
        let table = $('#first-table'),
            experts = table.find('#experts-first'),
            addExpert = table.find('#add-expert-first'),
            valueOfCriteria = table.find('#value-of-criteria'),
            expertTemp = `<th> <input type="text" class="expert-first weight" placeholder="Имя эксперта"> <button id="delete-expert-first">-</button> </th>`,
            expertInput = `<td><label><input class="expert-input" type="text" maxlength="2"></label></td>`,
            onDeleteExpert = function () {

                let me = $(this),
                    trs = table.find('tr'),
                    colIndex = me.parent().index() + 1;

                for (let i = 2; i < trs.length; i++) {
                    let tds = $(trs[i]).find('td');

                    tds.eq(colIndex).remove();
                }

                me.parent().remove();

                valueOfCriteria.attr('colspan', experts.find('th').length)

            },
            onAddExpert = function () {

                let temp = $(expertTemp),
                    trs = table.find('tr');

                experts.last().append(temp);

                valueOfCriteria.attr('colspan', experts.find('th').length)

                for (let i = 2; i < trs.length; i++) {
                    let tds = $(trs[i]).find('td');

                    tds.eq(tds.length - 3).after(expertInput);
                }

                temp.find('#delete-expert-first').click(onDeleteExpert);

                table.find('.expert-input').on('keypress', digitsValidator);

            },
            addCriteria = table.find('#add-criteria'),
            deleteCriteriaButtonTemp = `<td><button id="delete-criteria">-</button></td>`,
            criteriaTempFunc = function (tdsLength) {
                let tds = '';
                for (let i = 0; i < tdsLength; i++) {
                    tds += expertInput;
                }

                return `<tr>
                            <td><input type="string" class="weight" placeholder="Введите показатель качества"></td>
                            ${tds}
                            <td>
                                <input type="number" class="note_input" min="0" max="1" step="0.1">
                                (<input disabled id="weightVal" type="text" class="note_input" min="0" max="1" maxlength="4">)
                            </td>
                            <td><button id="add-criteria">+</button></td>
                        </tr>`

            },
            onDeleteCriteria = function () {
                $(this).parent().remove()
            },
            onAddCriteria = function () {

                let experts = table.find('.expert-first').length + 1,
                    criteriaTemp = $(criteriaTempFunc(experts)),
                    buttonTemp = $(deleteCriteriaButtonTemp)

                table.find('td').last().replaceWith(buttonTemp);

                table.find('tbody').last().append(criteriaTemp);

                table.find('td').last().click(onAddCriteria);

                table.find('.expert-input').on('keypress', digitsValidator);

                buttonTemp.click(onDeleteCriteria);

            },
            calculate = $('#calculate-first-table'),
            onCalculate = function () {

                let trs = table.find('tr'),
                    allValue = table.find('.expert-input').toArray().reduce(function (acc, input) {
                        let val = $(input).val();
                        return acc + (val == 0 ? 0 : parseFloat(val));
                    }, 0);


                trs.each(function () {
                    let tr = $(this),
                        inputsVal = tr.find('.expert-input').toArray().reduce(function (acc, input) {
                            let val = $(input).val();
                            return acc + (val == 0 ? 0 : parseFloat(val));
                        }, 0);

                    if (inputsVal != 0) {
                        let number = inputsVal / allValue;
                        tr.find('#weightVal').val(number == 0 ? 0 : Math.round((number + Number.EPSILON) * 100) / 100);
                    }
                });

            },
            onEvent = function () {
                addExpert.click(onAddExpert);
                addCriteria.click(onAddCriteria);
                calculate.click(onCalculate);
                table.find('.expert-input').on('keypress', digitsValidator);
            };

        onEvent();
    })

    $(function () {
        let mainTable = $('#main-table'),
            idCounter = 1,
            indexCounter = 1,
            plusTemplate = `<td id='creation-button' class="delete_creation_button"><button id='add-criterion'>+</button></td>`,
            minusTemplate = `<td id='delete-button' class="delete_creation_button"><button id='delete-criterion'>-</button></td>`,
            expertTemplate = (index) => {
                return `<th><input class="expert" type="text" placeholder="Имя эксперта"><button id='delete-expert'>-</button></th>`
            },
            criteriaTemplate = (id, tdsLength) => {

                let tds = '';
                for (let i = 0; i < tdsLength; i++) {
                    tds += `<td>
                    <input class="expert-note note_input" type='text' min='0' max='100' step='10' maxlength="4">
<!--                   (<input disabled type='number' class='weight' min='0' max='100'>)-->
                </td>`;
                }

                return `<tr id='${id}'>
                <td><input type="text" placeholder="Введите показатель качества"></td>
                ${tds}
             </tr>`;
            },
            expertInput = `<td> <input class="expert-note note_input" type='text' min='0' max='100' step='10' maxlength="4">
<!--            (<input disabled type='number' class='weight' min='0' max='100'>) </td>-->`,
            deleteFn = function () {
                $(this).parent().remove();
            },
            addCriteria = function () {

                mainTable.find('td').last().replaceWith($(minusTemplate).click(deleteFn));

                let criteria = $(criteriaTemplate(++idCounter, mainTable.find('.expert').length + 1));

                mainTable.find('tbody').last().append(criteria);

                criteria.find('td').last().after(plusTemplate).next().click(addCriteria);

                $('.expert-note').on('change', procentValidator);

            },
            deleteExpert = function () {

                let me = $(this),
                    trs = mainTable.find('tr'),
                    colIndex = me.parent().index() + 1;

                for (let i = 2; i < trs.length; i++) {
                    let tds = $(trs[i]).find('td');

                    tds.eq(colIndex).remove();
                }

                me.parent().remove();

                $('#assessment').attr('colspan', trs.find('th').length)
            },
            addExpert = function () {

                let trs = mainTable.find('tr'),
                    template = $(expertTemplate(++indexCounter));

                $('#experts').last().append(template)

                template.find('#delete-expert').click(deleteExpert)

                for (let i = 2; i < trs.length; i++) {
                    let tr = trs[i],
                        tds = $(tr).find('td');

                    tds.eq(0).after(expertInput);
                }

                $('#assessment').attr('colspan', trs.find('th').length);

                $('.expert-note').on('change', procentValidator);
            },
            calculate = function () {
                let val = 0,
                    recommendVal = $('#recommendVal'),
                    recommendNote = $('#recommendNote'),
                    notes = $('.note_input').filter(function (s) {
                        return $(this).val() != 0;
                    });


                notes.each(function () {
                    val = val + parseFloat($(this).val())
                })

                recommendVal.val(val / notes.length);
                recommendNote.val(function () {
                    if (val >= .85) return "отл.";
                    if (val >= .7 && val < .85) return "хор.";
                    if (val >= .5 && val < .7) return "удовл.";
                    if (val < .5) return "неуд.";
                })
            },
            mainTableEvent = function () {
                $('#add-criterion').click(addCriteria);
                $('#delete-criterion').click(deleteFn);
                $('#add-expert').click(addExpert);
                $('.calculate_w1').click(calculate);
                $('.expert-note').on('change', procentValidator);
            };

        mainTableEvent();

    })

})