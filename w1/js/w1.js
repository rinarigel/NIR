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
                    tds += `<td class='sum'><input class="expert-note note_input" type='text' min='0' max='100' step='10' maxlength="4"></td>`;
                }

                return `<tr id='${id}'><td><input type="text" placeholder="Введите показатель качества"></td>${tds}</tr>`;
            },
            expertInput = `<td class='sum'> <input class="expert-note note_input" type='text' min='0' max='100' step='10' maxlength="4">`
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
                    let tr = $(trs[i]),
                        tds = tr.find('td');

                    tds.eq(0).after(expertInput);
                }

                $('#assessment').attr('colspan', trs.find('th').length);

                $('.expert-note').on('change', procentValidator);
            },
            setResult = function (acc, acc2) {

                $('#weight-table').find('tr').eq(2).find('td').each(function (index) {
                    let elem = acc[index];
                    if (elem) {
                        $(this).find('input').val(elem.FinW);
                    }
                })

                $('#final-table').find('tr').eq(2).find('td').each(function (index) {
                    let elem = acc2[index];
                    if (elem) {
                        $(this).find('input').val(elem);
                    }
                });

            },
            calculateWeight = function () {

                let trs = mainTable.find('tr');

                mainTable.sumtr({
                    readValue: function (me) {
                        let val = me.find('input').val() || 0;
                        return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
                    },
                    onComplete: function (sums) {

                        let acc = [];

                        for (let j = 1; j < sums.length - 1; j++) {

                            let tdSum = sums[j],
                                trs = mainTable.find('tr'),
                                colIndex = j;

                            acc.push({sum: tdSum, colVal: []});

                            for (let i = 2; i < trs.length; i++) {
                                let tds = $(trs[i]).find('td');

                                let number = parseFloat(tds.eq(colIndex).find('input').val() || 0);

                                acc[j - 1].colVal.push(number);
                            }
                        }

                        let Ds = {};
                        for (let i = 2; i < trs.length; i++) {
                            let objectIndex = i - 2,
                                tds = $(trs[i]).find('td'),
                                rowElements = tds.length - 2;

                            for (let k = 1; k < tds.length - 1; k++) {
                                let val = parseFloat($(tds[k]).find('input').val());
                                Ds[objectIndex] = ((Ds[objectIndex] || 0) + val);
                            }
                            Ds[objectIndex] = Ds[objectIndex] / rowElements
                        }

                        console.log(Ds)

                        let rs = acc.map(function (elem) {
                            elem.colMod = elem.colVal.map(function (num, index) {
                                return Math.abs(num - Ds[index])
                            })
                            return elem;
                        })

                        //     .map(function (elem) {
                        //     let calculateMod = elem.colMod.reduce(function (acc, num) {
                        //         return acc + num;
                        //     }, 0)
                        //
                        //     elem.r1 = calculateMod / elem.sum
                        //     return elem;
                        // });


                        // let R = rs.reduce(function (acc, elem) {
                        //     return acc + elem.r1;
                        // }, 0);

                        // .map(function (elem) {
                        //     elem.Wn = elem.r1 / R;
                        //     return elem;
                        // })

                        // .map(function (elem) {
                        //     elem.W = elem.Wn * 0.5;
                        //     return elem;
                        // })

                        // .map(function (elem, index) {
                        //     let val = parseFloat($('#first-table').find('tr').eq(index + 2).find('td').last().prev().find('#weightVal').val()) * 0.5;
                        //     elem.FinW = elem.W + val;
                        //     return elem;
                        // })

                        // rs.map(function (elem) {
                        //     elem.studentNote = elem.colVal.reduce(function (acc, num, index) {
                        //         return acc + (num * acc2[index].FinW)
                        //     }, 0);
                        //     return elem;
                        // })


                        let acc2 = {},
                            R = 0;

                        $(rs).each(function (index, elem) {
                            elem.colVal.forEach(function (e, index) {
                                acc2[index] = (acc2[index] || {});
                                acc2[index].vals = (acc2[index].vals || []);
                                acc2[index].vals.push(e);
                            })
                            elem.colMod.forEach(function (e, index) {
                                acc2[index] = (acc2[index] || []);
                                acc2[index].valsMod = (acc2[index].valsMod || []);
                                acc2[index].valsMod.push(e);
                            })
                        });

                        $.each(acc2, function (index, elem) {
                            let reduce = elem.valsMod.reduce((acc, e) => acc + e, 0);
                            acc2[index].Rn = reduce / (Ds[index] * elem.valsMod.length);
                        })

                        $.each(acc2, (index, elem) => {
                            R = R + elem.Rn
                        })

                        $.each(acc2, (index, elem) => {
                            acc2[index].Wn = elem.Rn / R;
                        })

                        $.each(acc2, (index, elem) => {
                            acc2[index].W = elem.Wn * 0.5;
                        })

                        $.each(acc2, (index, elem) => {
                            let tableElem = parseFloat($('#first-table').find('tr').eq(+index + 2).find('td').last().prev().find('#weightVal').val()),
                                val = tableElem * 0.5;
                            elem.FinW = elem.W + val;
                        })

                        $.each(acc2, (index, elem) => {
                            elem.WeightOfNum = elem.vals.map(function (num) {
                                return num * elem.FinW;
                            });
                        })

                        let studentNotes = {};
                        $.each(acc2, (index, elem) => {
                            elem.WeightOfNum.forEach(function (e, i) {
                                studentNotes[i] = (studentNotes[i] || 0) + e;
                            })
                        })

                        setResult(acc2, studentNotes);
                    }
                });

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
                    if (val >= 0.85) return "отл.";
                    if (val >= 0.7 && val < 0.85) return "хор.";
                    if (val >= 0.5 && val < 0.7) return "удовл.";
                    if (val < 0.5) return "неуд.";
                })

                calculateWeight();
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