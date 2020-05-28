$(function () {

    let mainTable = $('#main-table'),
        idCounter = 1,
        indexCounter = 1,
        plusTemplate = `<td id='creation-button'><button id='add-criterion'>+</button></td>`,
        minusTemplate = `<td id='delete-button'><button id='delete-criterion'>-</button></td>`,
        expertTemplate = (index) => {
            return `<th><input class="expert" type='string' min='0' max='100'><button id='delete-expert'>-</button></th>`
        },
        criteriaTemplate = (id, tdsLength) => {

            let tds = '';
            for (let i = 0; i < tdsLength; i++) {
                const minusTemplateElement = minusTemplate[i];
                tds += `<td>
                    <input type='number' class='note-input' min='0' max='100' step='10'>
                    (<input disabled type='number' class='weight' min='0' max='100'>)
                </td>`;
            }

            return `<tr id='${id}'>
                <td><input type='string' min='0' max='100'></td>
                ${tds}
             </tr>`;
        },
        expertInput = `<td> <input  type='number' class='note-input' min='0' max='100' step='10'> (<input disabled type='number' class='weight' min='0' max='100'>) </td>`

    let deleteFn = function () {
            $(this).parent().remove();
        },
        addCriteria = function () {

            mainTable.find('td').last().replaceWith($(minusTemplate).click(deleteFn));

            let criteria = $(criteriaTemplate(++idCounter, mainTable.find('.expert').length + 1));

            mainTable.find('tbody').last().append(criteria);

            criteria.find('td').last().after(plusTemplate).next().click(addCriteria);

        },
        deleteExpert = function () {

            let me = $(this),
                trs = mainTable.find('tr');

            me.closest('table').find('td').eq(me.parent().index() + 1)[0].remove();

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

            $('#assessment').attr('colspan', trs.find('th').length)
        },
        calculate = function () {
            let val = 0,
                recommendVal = $('#recommendVal'),
                notes = $('.note-input').filter(function (s) {
                    return $(this).val() != 0;
                });


            notes.each(function () {
                val = val + parseInt($(this).val())
            })
            recommendVal.val(val / notes.length);
        };

    $('#add-criterion').click(addCriteria);
    $('#delete-criterion').click(deleteFn);
    $('#add-expert').click(addExpert);
    $('.calculate_w1').click(calculate);

})