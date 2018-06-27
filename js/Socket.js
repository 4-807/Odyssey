function initSocket() {
    socket = io("http://47.100.165.222:3000");

    // socket.emit("new-player", id, 0, 404);

    socket.emit("new-player-confirm", id);

    socket.on('quit-notify', function (id) {
        for (var i = 0; i < players.length; i++) {
            if (id == players[i].id) {
                players[i].quit();
                players.splice(i, 1);
                break;
            }
        }
    });

    socket.on('syn-pos', function (syn_players) {
        setRankList(syn_players);
        ball.material = ballMaterialW;
        for (var syn_index in syn_players) {
            var syn_player = syn_players[syn_index];
            if (syn_player.cure && (syn_player.position.x != 0 || syn_player.position.z != 0))
                ball.material = ballMaterialG;
            for (var j = 0; j < players.length; j++) {
                if (syn_index == players[j].id) {
                    players[j].updateState(syn_player);
                    break;
                }
            }
            if (syn_index == id) {
                setHealth(syn_player.hp, syn_player.hpMax);
                hero.updateKill(syn_player.kills, killLogo);
                if (syn_player.deadtime > 2000) {
                    clearInterval(fireTid);
                    hero.die();
                }
            }
        }
    });

    function setRankList(data){

        var rank = document.getElementById("rank-list");
        var list = [];
        var index = 0;
        for (var i in data){
            list[index] = data[i];
            index++;
        }

        var sorted = list.sort(compareObj("score"));

        rank.innerText = "排行榜：\n";

        for(var j in sorted){
            rank.innerText += j+"        "+sorted[j].id+" : "+sorted[j].score+"(最高分："+sorted[j].maxScore+")\n";
        }
    }

    function compareObj(property){
        return function(obj1,obj2){
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value2 - value1;
        }
    }

    function setHealth(cur, total){
        cur = Math.max(0, cur);

        var text = document.getElementById("blood-text");
        text.innerText = Math.floor(cur)+"/"+total;
        var bar = document.getElementById("blood-bar");

        bar.style.width = (33.3*cur/total)+"%";
    }

    socket.on('new-comer', function (player_id) {
        if (player_id == id) return;
        for (var i = 0; i < players.length; i++) {
            if (player_id == players[i].id)
                return;
        }

        var player = new Player(scene, player_id, audioListener);
        player.initModel();
        players.push(player);
    });

    socket.on('shoot-result', function (start, direction, distance) {
        // console.log(distance);
        if (hero.loaded) {
            var laser = new Laser(scene, start, direction, distance, laserMaterial);
            lasers.push(laser);
            if (laserSoundLoadOK)
                laserAudio(laser.getObject());
        }
    });

    socket.on('new-message', function (name, msg) {
        showMsg(name, msg);
    });

    var quit_div = document.getElementById("quit");
    quit_div.onclick = function(e){
        socket.emit("quit-player", id);
        window.close();
    };


    var tid = setInterval(function () {
        if (hero.loaded)
            socket.emit('report-pos',
                id,
                hero.playing_run_forward,
                hero.playing_run_backward,
                hero.playing_run_left,
                hero.playing_run_right,
                hero.playing_jump_forward,
                hero.playing_jump_backward,
                hero.playing_fire,
                hero.playing_reload,
                hero.playing_die,
                hero.getModelPosition(),
                hero.getModelRotation());
    }, 50);
}