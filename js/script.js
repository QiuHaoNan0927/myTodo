;(function () {
    'use strict';
    var $form_add_task = $('.add-task'),
        task_list = [],
        $task_delete_trigger,
        $task_detail_trigger,
        $task_detail = $(".task-detail"),
        $task_detail_mask = $(".task-detail-mask");
    // store.clear();
    init();
    $form_add_task.on('submit', on_add_task_form_submit);
    $task_detail_mask.on('click', hide_task_detail);
    function on_add_task_form_submit(e) {
        //每一次触发事件都需要重新定义一次对象 否则会不断更改一个对象
        var new_task = {},
            //获取新task的值
            $input = $(this).find('input[name=content]');
        //禁用默认行为
        e.preventDefault();
        new_task.content = $input.val();
        // 如果新task为空则返回
        if (!new_task.content) {
            return;
        }
        //存入新task值
        if (add_task(new_task)) {
            // render_task_list();
            $input.val(null);
        }
    }

    function listen_task_detail() {
        $task_detail_trigger.on("click", function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            show_task_detail(index);
            console.log(123)
        })
    }

    function show_task_detail(index) {
        render_task_detail(index);
        $task_detail.show();
        $task_detail_mask.show();
    }

    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    //渲染指定task的详细信息
    function render_task_detail(index) {
        if (index === undefined || !task_list[index]) {
            return;
        }
        var item = task_list[index];
        var tpl = '<form>' +
            '<div class="content">' +
            item.content +
            '</div>' +
            '<div>' +
            '<div class="desc">' +
            '<textarea value="' + item.desc + '"></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="remind">' +
            '<input type="date">' +
            '<button type="button" name="button" type="submit">submit</button>' +
            '</div>' +
            '</form>';
        $task_detail.html(null);
        $task_detail.html(tpl);
    }

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
    }

    //添加数据
    function add_task(new_task) {
        task_list.push(new_task);
        //更新localstore数据
        refresh_task_list();
        return true;
    }

    //刷新localstore数据并渲染模版
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    // 删除一条task
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

    //渲染全部task模版
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++) {
            var $task = render_task_tpl(task_list[i], i);
            $task_list.append($task);
        }
        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }

    //查找并监听所有删除按钮的点击事件
    function listen_task_delete() {
        $task_delete_trigger.on('click', function () {
            var $this = $(this);
            //找到删除按钮所在的task
            var $item = $this.parent().parent();
            var index = $item.data('index');
            // 确认删除
            var tmp = confirm('确定删除？');
            tmp ? delete_task_list(index) : null;
        })
    }

    //渲染单条task数据
    function render_task_tpl(data, index) {
        if (!data || !index) return;
        var list_item_tpl = "<div class='task-item' data-index='" + index + "'><span><input type='checkbox'></span><span class='task-content'>" + data.content + "</span><span class='fr'><span class='action delete'> 删除</span><span class='action detail'> 详细</span></span></div>";
        return $(list_item_tpl);
    }
})();


