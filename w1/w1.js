$(function () {

    let mainTable = $('#main-table'),
        idCounter = 1,
        indexCounter = 1,
        plusTemplate = `<td id='creation-button' class="delete_creation_button"><button id='add-criterion'>+</button></td>`,
        minusTemplate = `<td id='delete-button' class="delete_creation_button"><button id='delete-criterion'>-</button></td>`,
        expertTemplate = (index) => {
            return `<th><input class="expert" type='string' placeholder="Имя эксперта"><button id='delete-expert'>-</button></th>`
        },
        criteriaTemplate = (id, tdsLength) => {

            let tds = '';
            for (let i = 0; i < tdsLength; i++) {
                const minusTemplateElement = minusTemplate[i];
                tds += `<td>
                    <input type='number' class='note_input' min='0' max='100' step='10'>
<!--                    (<input disabled type='number' class='weight' min='0' max='100'>)-->
                </td>`;
            }

            return `<tr id='${id}'>
                <td><input type='string' placeholder="Введите показатель качества"></td>
                ${tds}
             </tr>`;
        },
        expertInput = `<td> <input  type='number' class='note_input' min='0' max='100' step='10'> 
<!--(<input disabled type='number' class='weight' min='0' max='100'>) </td>-->`

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
                recommendNote = $('#recommendNote'),
                notes = $('.note_input').filter(function (s) {
                    return $(this).val() != 0;
                });


            notes.each(function () {
                val = val + parseInt($(this).val())
            })

            recommendVal.val(val / notes.length);
            recommendNote.val(function (val) {
                if (val >= 85) return "отл.";
                if (val >= 70 && val < 85) return "хор.";
                if (val >= 50 && val < 70) return "удовл.";
                if (val < 50) return "неуд.";
            })
        };

    $('#add-criterion').click(addCriteria);
    $('#delete-criterion').click(deleteFn);
    $('#add-expert').click(addExpert);
    $('.calculate_w1').click(calculate);

})