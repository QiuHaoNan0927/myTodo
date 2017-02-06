;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
        task_list = [],
        $delete_task;
    // store.clear();
    init();
    $form_add_task.on('submit', function (e) {
        //每一次触发事件都需要重新定义一次对象 否则会不断更改一个对象
        var new_task = {},
            $input = $(this).find('input[name=content]');
        //禁用默认行为
        e.preventDefault();
        new_task.content = $input.val();
        if (!new_task.content) {
            return;
        }

        if (add_task(new_task)) {
            // render_task_list();
            $input.val(null);
        }
    });
    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
        // listion_task_delete();
    }

    function add_task(new_task) {
        task_list.push(new_task);
        refresh_task_list();
        return true;
    }

    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    function delete_task_list(index) {
        //判断是否存在参数或者数据内是否存在第index项
        if (index === undefined || !task_list[index]) {
            return;
        }
        // 删除对应项
        delete task_list[index];
        //更新localstore
        refresh_task_list();
    }


    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++) {
            var $task = render_task_tpl(task_list[i], i);
            $task_list.append($task);
        }
        $delete_task = $('.action.delete');
        listion_task_delete();
    }

    function listion_task_delete() {
        $delete_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('确定删除？');
            tmp ? delete_task_list(index) : null;
        })
    }

    function render_task_tpl(data, index) {
        if (!data || !index) return;
        var list_item_tpl = "<div class='task-item' data-index='" + index + "'><span><input type='checkbox'></span><span class='task-content'>" + data.content + "</span><span class='fr'><span class='action delete'> 删除</span><span class='action'> 详细</span></span></div>";
        return $(list_item_tpl);
    }
})();


