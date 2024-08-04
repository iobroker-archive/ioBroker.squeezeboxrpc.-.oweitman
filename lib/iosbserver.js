/* eslint-disable quotes */
'use strict';

//const utils = require('@iobroker/adapter-core');
const dgram = require('dgram');
const SqueezeServer = require('squeezenode-oweitman');
const ioSBPlayer = require(__dirname + '/iosbplayer');

function IoSbServer(adapter) {


    this.sbServerStatus = {
        'lastscan': {
            name: 'LastScan',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'version': {
            name: 'Version',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'uuid': {
            name: 'uuid',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'name': {
            name: 'Name',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'mac': {
            name: 'mac',
            read: true,
            write: false,
            type: 'string',
            role: 'info.mac',
            exist: false
        },
        'info total albums': {
            name: 'TotalAlbums',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'info total artists': {
            name: 'TotalArtists',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'info total genres': {
            name: 'TotalGenres',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'info total songs': {
            name: 'TotalSongs',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'info total duration': {
            name: 'TotalDuration',
            read: true,
            write: false,
            type: 'number',
            role: 'media.duration',
            exist: false
        },
        'player count': {
            name: 'PlayerCount',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'sn player count': {
            name: 'PlayerCountSN',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'other player count': {
            name: 'PlayerCountOther',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'syncgroups': {
            name: 'SyncGroups',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'otherServers': {
            name: 'otherServers',
            read: true,
            write: true,
            type: 'string',
            role: 'value',
            exist: false
        },
        'getFavorites': {
            name: 'getFavorites',
            read: true,
            write: true,
            type: 'boolean',
            role: 'button',
            def: false,
            exist: false
        }
    };
    this.sbFavoritesState = {
        'name': {
            name: 'Name',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'type': {
            name: 'type',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'id': {
            name: 'id',
            read: true,
            write: false,
            type: 'string',
            role: 'value',
            exist: false
        },
        'hasitems': {
            name: 'hasitems',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        },
        'url': {
            name: 'url',
            read: true,
            write: false,
            type: 'string',
            role: 'media.url',
            exist: false
        },
        'image': {
            name: 'image',
            read: true,
            write: false,
            type: 'string',
            role: 'url.icon',
            exist: false
        },
        'isaudio': {
            name: 'isaudio',
            read: true,
            write: false,
            type: 'number',
            role: 'value',
            exist: false
        }
    };

    this.ServerStatePath = 'Server';
    this.FavoritesStatePath = 'Favorites';
    this.PlayersStatePath = 'Players';

    this.currentStates = {};
    this.players = [];
    this.observers = [];

    this.adapter = adapter;

    this.adapter.setState('info.connection', false, true);
    this.adapter.subscribeStates('*');

    this.sbServer = (adapter.config.username != "") ? new SqueezeServer('http://' + this.adapter.config.server, Number.parseInt(this.adapter.config.port), adapter.config.username, adapter.config.password) : new SqueezeServer('http://' + this.adapter.config.server, Number.parseInt(this.adapter.config.port));

    this.log = {};
    this.logsilly = this.adapter.config.outputserversilly;
    this.logdebug = this.adapter.config.outputserverdebug;
    this.errmax = 5;
    this.errcnt = -1;
    this.connected = 0;
    this.firstStart = true;
    this.server = null;
    this.telnet = null;
    this.otherserver = [];

    this.init = function () {
        this.setState('connection', true, 'info');
        this.doObserverServer();
        this.doObserverFavorites();
        this.doTelnet();
    };
    this.doObserverServer = function () {
        this.log.silly('doObserverServer');
        this.getServerstatus();
        this.setTimeout('serverstatus', this.doObserverServer.bind(this), this.adapter.config.serverrefresh * 1000);
    };
    this.processMessages = function (msg) {
        this.log.debug("processMessages " + JSON.stringify(msg));
        if (msg.command === "discoverlms") {
            this.log.debug("send discoverlms");
            this.discoverLMS(msg);
        }
    };
    this.discoverLMS = function (msg) {
        this.log.debug("discoverLMS " + JSON.stringify(msg));
        const data = [];
        for (const [key, srv] of Object.entries(this.otherserver)) {
            data.push({ label: `${srv.NAME}/${srv.ADDRESS}`, value: srv.ADDRESS });
        }
        this.adapter.sendTo(msg.from, msg.command, [{ value: '', label: '---' }, ...data], msg.callback);
    };
    this.setTimeout = function (id, callback, time) {
        this.clearTimeout(id);
        this.observers[id] = setTimeout(callback.bind(this), time);
    };
    this.setInterval = function (id, callback, time) {
        this.clearInterval(id);
        this.observers[id] = setInterval(callback.bind(this), time);
    };
    this.clearInterval = function (id) {
        if (this.observers[id]) clearInterval(this.observers[id]);
        delete this.observers[id];
    };
    this.clearTimeout = function (id) {
        if (this.observers[id]) clearTimeout(this.observers[id]);
        delete this.observers[id];
    };
    this.doObserverFavorites = function () {
        this.log.silly('doObserverFavorites');

        if (!this.adapter.config.usefavorites) {
            this.newdelFavorites();
            return;
        }
        this.newgetFavorites();
        this.setTimeout('favorites', this.doObserverFavorites.bind(this), this.adapter.config.favoriterefresh * 60 * 1000);
    };
    this.getDiscoverServers = function () {
        this.log.silly('getDiscoverServers');
        if (!this.adapter.config.usediscovery) {
            this.delState(this.ServerStatePath, this.sbServerStatus['otherServers'].name, function () {
                this.delObject(this.ServerStatePath, this.sbServerStatus['otherServers'].name);
            }.bind(this));
            return;
        }
        this.server = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        const broadcastPort = 3483;
        this.server.bind(broadcastPort, '0.0.0.0', function () {
            this.server.setBroadcast(true);
        }.bind(this));
        this.server.on('message', function (data, rinfo) {
            this.log.silly('getDiscoverServers: Message resceived ' + escape(data));
            if (data.toString().charAt() == 'E') {
                let msg = data.toString();
                msg = msg.substr(1);
                const srv = {};
                let len = msg.length;
                let tag, len2, val;
                while (len > 0) {
                    tag = msg.substr(0, 4);
                    len2 = msg.charCodeAt(4);
                    val = msg.substr(5, len2);
                    msg = msg.substr(len2 + 5);
                    len = len - len2 - 5;
                    srv[tag] = val;
                }
                srv['ADDRESS'] = rinfo.address;
                srv['TIMESTAMP'] = Date.now();
                this.otherserver[srv['ADDRESS']] = srv;
                const state = {};
                Object.assign(state, this.sbServerStatus['otherServers']);
                state.name = srv['ADDRESS'].replace(/\./g, '-');
                state.def = JSON.stringify(srv);
                this.createObject(state, this.ServerStatePath, this.sbServerStatus['otherServers'].name, function () {
                    this.setState(srv['ADDRESS'].replace(/\./g, '-'), JSON.stringify(srv), this.ServerStatePath, this.sbServerStatus['otherServers'].name, false);
                }.bind(this));
                this.log.debug('Autodiscover: Server found ' + srv['NAME'] + ' IP: ' + srv['ADDRESS'] + ' Port ' + srv['JSON'] + ' UUID ' + srv['UUID']);
            }
        }.bind(this));
        this.server.on('error', function (err) {
            this.log.error("Error with Server discovery " + err.message);
            if (err.message.includes("EADDRINUSE")) {
                this.log.info("use 'lsof -i -P' to check for ports used.");
            }
            try {
                this.server.close(function () {
                    this.log.info("Server discovery deactivated.");
                    this.server = null;
                }.bind(this));
            } catch (err) {
                this.log.error("server.close() " + err.message);
            }
        }.bind(this));
        setTimeout(this.doDiscoverServerSearch, 1000);
    };
    this.doDiscoverServerSearch = function () {
        this.log.silly('doDiscoverServerSearch');
        const msg = Buffer.from('eIPAD\0NAME\0JSON\0UUID\0VERS');
        const broadcastAddress = '255.255.255.255';
        const broadcastPort = 3483;
        this.getStates('*', this.ServerStatePath, this.sbServerStatus['otherServers'].name, function (err, states) {
            for (const id in states) {
                const srv = JSON.parse(states[id].val);
                if (((Date.now() - srv.TIMESTAMP) / 1000) > 60) {
                    this.delObject(id);
                    this.log.debug('Autodiscover: Server removed ' + srv['NAME'] + ' IP: ' + srv['ADDRESS'] + ' Port ' + srv['JSON'] + ' UUID ' + srv['UUID']);
                }
            }
        }.bind(this));
        if (!this.server) return;
        this.server.send(msg,
            0,
            msg.length,
            broadcastPort,
            broadcastAddress,
            function (err) {
                if (err) this.log.error(err);
            }
        );
        this.setTimeout('discover', this.doDiscoverServerSearch.bind(this), this.adapter.config.discoveryrefresh * 1000);
    }.bind(this);
    this.doDiscoverServerClose = function () {
        this.log.debug('doDiscoverServerClose');
        this.server.close();
    };
    this.doTelnet = function () {
        if (!this.adapter.config.usetelnet) return;
        const net = require('net');
        this.telnet = net.createConnection({ host: this.adapter.config.server, port: this.adapter.config.telnetport }, () => {
            this.log.debug('doTelnet connected to server!');
            this.telnet.write('login ' + this.adapter.config.username + ' ' + this.adapter.config.password + '\r\n');
            this.telnet.write('listen 1\r\n');
        });
        this.telnet.on('data', (data) => {
            this.log.debug('doTelnet received Data: ' + data.toString());
            const regex = /^((?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2}))\s*(.*)/gm;
            let m;
            if ((m = regex.exec(decodeURIComponent(data.toString()))) !== null) {
                if (m[2] == 'client reconnect') {
                    this.log.debug('doTelnet received reconnect for : ' + m[1]);
                    this.getServerstatus();
                }
                if (m[2] == 'client disconnect') {
                    this.log.debug('doTelnet received disconnect for : ' + m[1]);
                    this.getServerstatus();
                }
                if (m[2] == 'client new') {
                    this.log.debug('doTelnet received disconnect for : ' + m[1]);
                    this.getServerstatus();
                }
                if (m[2] == 'power 0') {
                    this.log.debug('doTelnet received power off : ' + m[1]);
                    this.getServerstatus();
                }
                if (m[2] == 'power 1') {
                    this.log.debug('doTelnet received power on : ' + m[1]);
                    this.getServerstatus();
                }
            }
        });
        this.telnet.on('end', () => {
            this.log.debug('doTelnet disconnected from server');
        });
        this.telnet.on('timeout', () => {
            this.log.debug('doTelnet Socket timeout, closing');
            this.telnet.close();
        });
        this.telnet.on('error', (err) => {
            this.log.debug('doTelnet Socket error: ' + err.message);
        });
        this.telnet.on('close', (err) => {
            this.log.debug('doTelnet Socket closed');
        });
    }
    this.doTelnetClose = function () {
        this.log.debug('doTelnetClose');
        this.telnet.end();
    };
    this.closeConnections = function () {
        if (this.adapter.config.usetelnet) this.doTelnetClose();
        if (this.adapter.config.usediscovery) this.doDiscoverServerClose();
    }
    this.getServerstatus = function () {
        this.log.silly('getServerstatus');
        this.request('', ['serverstatus', '0', '888'], this.doServerstatus.bind(this));
        this.request('', ['syncgroups', '?'], this.doSyncgroups.bind(this));
    };
    this.doSyncgroups = function (result) {
        if (result.result && result.result.syncgroups_loop) {
            this.setState(this.sbServerStatus['syncgroups'].name, JSON.stringify(result.result.syncgroups_loop), this.ServerStatePath);
        }
    };
    this.doServerstatus = function (result) {
        this.log.silly('doServerstatus');
        this.checkServerstatusStates(result);
        for (const key in this.sbServerStatus) {
            if (result.result.hasOwnProperty(key)) {
                this.setState(this.sbServerStatus[key].name, this.convertState(this.sbServerStatus[key], result.result[key]), this.ServerStatePath);
            }
        }
        this.checkNewPlayer(result.result.players_loop);
        this.checkPlayer(result.result.players_loop);
    };
    this.newgetFavorites = function () {
        this.log.silly('newgetFavorites');
        this.newgetFavoritesDP(
            (states) => this.newdelFavoritesDP(states,
                () => this.newgetFavoritesLMS('',
                    (result) => this.newsetFavoritesDP(result)
                )
            )
        );
    };
    this.newdelFavorites = function () {
        this.log.silly('newgetFavorites');
        this.newgetFavoritesDP(
            (states) => this.newdelFavoritesDP(states)
        );
    };
    this.newgetFavoritesDP = function (callback) {
        this.log.silly('newgetFavoritesDPs');

        var id = this.FavoritesStatePath;
        this.adapter.getStates(id + '*', (err, states) => {
            if (!err) {
                callback(states);
            } else this.log.info(err);
        });
    };
    this.newgetFavoritesLMS = function (id = '', callback) {
        this.log.silly('newgetFavoritesLMS');
        this.request('', ['favorites', 'items', '0', '888', 'want_url:1', 'item_id:' + id],
            (result) => callback(result.result.loop_loop)//.bind(this);
        );
    };
    this.newdelFavoritesDP = function (states, callback) {
        this.log.silly('newdelFavoritesDP');
        let promises = [];
        for (const id in states) {
            this.log.debug(`Start to delete object => ${id}`);
            promises.push(new Promise(function (resolve) {
                this.delObject(id, false, false, resolve);
            }.bind(this)));
        }
        Promise.all(promises).then(function () {
            this.log.debug(`All favorite objects deleted`);
            if (callback) callback();
        }.bind(this));
    };
    this.newsetFavoritesDP = function (favorites) {
        this.log.silly('newsetFavoritesDP');
        for (const favkey in favorites) {
            const favorite = favorites[favkey];
            const oid = this.getFavId(favorite['id'], false);
            const id = this.getFavId(favorite['id']);
            for (const key in this.sbFavoritesState) {
                if (favorite.hasOwnProperty(key)) {
                    if (key == 'id') favorite['id'] = oid;
                    if (key == 'image') {
                        const regex = /imageproxy\/(.*)\/[^\/]/gm;
                        let m = regex.exec(favorite[key]);
                        if (m && m.index > 0) {
                            favorite[key] = decodeURIComponent(m[1]);
                        }
                    }
                    const stateTemplate = this.sbFavoritesState[key];
                    this.createObject(stateTemplate, this.FavoritesStatePath, id,
                        () => this.setState(this.sbFavoritesState[key].name, this.convertState(this.sbFavoritesState[key], favorite[key]), this.FavoritesStatePath, id, false)
                    );
                }
            }
            if (favorite['hasitems'] > 0) this.newgetFavoritesLMS(oid,
                (result) => this.newsetFavoritesDP(result)
            );
        }
    };
    /*
        this.getFavorites = function(id='') {
            this.log.silly('getFavorites');
            this.deleteFavorites(id,function() {
                this.request('',['favorites', 'items', '0', '888','want_url:1','item_id:' + id], this.doFavorites1.bind(this));
            }.bind(this));        
        };
        this.doFavorites1 = function(result){
            this.log.silly('doFavorites1');
            const favorites = result.result.loop_loop;
            this.checkFavoriteStates(favorites);
        };
        this.doFavorites2 = function(favorites){
            this.log.silly('doFavorites2');
            for (const favkey in favorites) {
                const favorite = favorites[favkey];
                const oid = this.getFavId(favorite['id'],false);
                const id = this.getFavId(favorite['id']);
                for (const key in this.sbFavoritesState){
                    if (favorite.hasOwnProperty(key)) {
                        if (key=='id') favorite['id'] = oid;
                        if (key == 'image' ) {
                            const regex = /imageproxy\/(.*)\/[^\/]/gm;
                            let m = regex.exec(favorite[key]);
                            if (m && m.index>0) {
                                favorite[key] = decodeURIComponent(m[1]);
                            }
                        }
                        this.setState(this.sbFavoritesState[key].name,favorite[key],this.FavoritesStatePath,id,false);
                    }
                }
                if (favorite['hasitems']>0) this.getFavorites(oid);
            }
        };
        this.checkFavoriteStates = function(favorites) {
            this.log.silly('checkFavoriteStates');
            for (const favkey in favorites) {
                const favorite = favorites[favkey];
                const id = this.getFavId(favorite['id']);
                for (const key in this.sbFavoritesState){
                    if (favorite.hasOwnProperty(key)) {
                        const stateTemplate = this.sbFavoritesState[key];
                        this.createObject(stateTemplate,this.FavoritesStatePath,id);                    
                    }
                }
            }
            this.doFavorites2(favorites);
        };
        this.deleteFavorites = function(typ,callback) { 
            if (typ!='') {
                callback();
                return;
            }
            var id = this.FavoritesStatePath;
            this.adapter.getStates(id + '*', (err, states) => {
                if(!err) {
                    let promises = [];
                    for (const id in states) {
                        this.log.debug(`Delete state => ${id}`);
                        promises.push( new Promise(function(resolve){
                            this.delObject(id,false,false,resolve);                        
                        }.bind(this)));                    
                    }
                    Promise.all(promises).then(function(){
                        callback();
                    });
                } else this.log.info(err);
            });        
        };
    */
    this.getFavId = function (id, replace = true) {
        let ret;
        if (id.indexOf('.') == 8) {
            ret = id.substr(9);
        } else {
            ret = id;
        }
        if (replace) ret = ret.replace(/\./g, '-');
        return ret;
    };
    this.checkServerstatusStates = function (result) {
        this.log.silly('checkServerstatusStates');
        for (const key in this.sbServerStatus) {
            if (result.result.hasOwnProperty(key)) {
                const stateTemplate = this.sbServerStatus[key];
                if (!this.currentStates[stateTemplate.name]) {
                    if (!stateTemplate.exist) {
                        this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
                    }
                }
            }
        }
        let key = 'getFavorites';
        let stateTemplate = this.sbServerStatus[key];
        if (!stateTemplate.exist) {
            this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
        }
        key = 'syncgroups';
        stateTemplate = this.sbServerStatus[key];
        if (!stateTemplate.exist) {
            this.sbServerStatus[key] = this.createObject(stateTemplate, this.ServerStatePath);
        }
    };
    this.checkNewPlayer = function (playersdata) {
        for (const key in playersdata) {
            if (!this.players.hasOwnProperty(playersdata[key].playerid)) {
                this.players[playersdata[key].playerid] = new ioSBPlayer(this, playersdata[key]);
            }
        }
    };
    this.checkPlayer = function (playersdata) {
        for (const key in playersdata) {
            if (this.players[playersdata[key].playerid].connected != playersdata[key].connected) {
                if (playersdata[key].connected == 0) {
                    this.players[playersdata[key].playerid].disconnect();
                }
                if (playersdata[key].connected == 1) {
                    this.players[playersdata[key].playerid].connect();
                }
            }
        }
    };
    this.stateChange = function (id, state) {
        // Warning, state can be null if it was deleted
        if (!id || !state || state.ack) {
            return;
        }
        const idParts = id.split('.');
        idParts.shift();
        idParts.shift();
        if (idParts[0] == this.ServerStatePath) this.doServerStateChange(idParts, state);
        if (idParts[0] == this.FavoritesStatePath) this.doFavoritesStateChange(idParts, state);
        if (idParts[0] == this.PlayersStatePath) this.doPlayersStateChange(idParts, state);
    };
    this.doServerStateChange = function (idParts, state) {
        idParts.shift();
        if (idParts[0] == 'getFavorites') {
            if (state.val == true) this.newgetFavorites();
        }
    };
    this.doFavoritesStateChange = function (idParts, state) {
        idParts.shift();
        if (state) return;
    };
    this.doPlayersStateChange = function (idParts, state) {
        idParts.shift();
        const player = this.findPlayerByName(idParts[0]);
        if (player) player.doStateChange(idParts, state);
    };
    this.findPlayerByName = function (name) {
        for (const key in this.players) {
            if (this.players[key].playername == name) return this.players[key];
        }
    };
    this.request = function (playerid, params, callback) {
        this.sbServer.request(playerid, params, function (callback, result) {
            if (result.ok) {
                this.connected = 1;
                this.errcnt = -1;
                this.firstStart = false;
                if (callback) callback(result);
            } else {
                if (this.firstStart) this.disconnect();
                if (this.errcnt == -1) this.errcnt = this.errmax;
                this.errcnt--;
                if (this.errcnt == 0) {
                    this.errcnt = -1;
                    this.disconnect();
                }
            }
        }.bind(this, callback));
    };
    this.disconnect = function () {
        this.log.debug('Server disconnect');
        this.firstStart = false;
        this.connected = 0;
        this.clearTimeout('serverstatus');
        this.clearTimeout('favorites');
        if (this.connected == 0 && this.observers['checkserver']) return;
        this.setState('connection', false, 'info');
        for (const key in this.players) {
            this.players[key].disconnect();
        }
        this.setInterval('checkserver', this.doCheckServer.bind(this), 10 * 1000);
    };
    this.connect = function () {
        this.log.debug('Server connect');
        this.clearInterval('checkserver');
        this.setState('connection', true, 'info');
        this.connected = 1;
        this.init();
    };
    this.doCheckServer = function () {
        this.log.silly('doCheckServer');
        this.request('', ['serverstatus', '0', '888'], function (result) {
            if (result.ok) {
                this.connect();
            }
        }.bind(this));
    };
    this.setState = function (name, value, level1path = false, level2path = false, check = true, callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        if (this.currentStates[name] !== value && check) {
            this.currentStates[name] = value;
            this.log.silly('setState name: ' + name + ' value: ' + value);
            this.adapter.setState(name, value, true, callback);
        } else {
            this.currentStates[name] = value;
            this.log.silly('setState name: ' + name + ' value: ' + value);
            this.adapter.setState(name, value, true, callback);
        }
    };
    this.getState = function (name, level1path = false, level2path = false, callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        this.adapter.getState(name, callback);
    };
    this.delObject = function (name, level1path = false, level2path = false, callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        delete this.currentStates[name];
        this.adapter.delObject(name, callback);
    };
    this.delState = function (name, level1path = false, level2path = false, callback) {
        name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + name;
        delete this.currentStates[name];
        this.adapter.delState(name, callback);
    };
    this.getStates = function (pattern, level1path = false, level2path = false, callback) {
        const name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + pattern;
        this.adapter.getStates(name, callback);
    };
    this.createObject = function (stateTemplate, level1path = false, level2path = false, callback = false) {
        const name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + stateTemplate.name;
        this.log.debug('createObject ' + name);
        this.adapter.getObject(name, (err, obj) => {
            var newobj = {
                type: 'state',
                common: stateTemplate,
                native: {}
            };
            if (!obj) {
                (callback) ? this.adapter.setObject(name, newobj, callback) : this.adapter.setObject(name, newobj);
            } else {
                if (callback) callback();
            }
        });
        stateTemplate.exist = true;
        return stateTemplate;
    }
    this.createState = function (stateTemplate, level1path = false, level2path = false, callback) {
        const name = (level1path ? level1path + '.' : '') + (level2path ? level2path + '.' : '') + stateTemplate.name;
        this.log.silly('Create Key ' + name);
        this.adapter.createState(level1path, level2path, stateTemplate.name, stateTemplate, callback);
        stateTemplate.exist = true;
        return stateTemplate;
    };
    this.convertState = function (stateTemplate, value) {
        if (stateTemplate.type == "string") return String(value);
        if (stateTemplate.type == "number") return Number(value);
        this.log.debug('Missing conversion function for type ' + stateTemplate.type + ' Please report.');
        return value;
    }
    this.log.silly = function (s) {
        if (this.logsilly) this.adapter.log.silly(s);
    }.bind(this);
    this.log.debug = function (s) {
        if (this.logdebug) this.adapter.log.debug(s);
    }.bind(this);
    this.log.error = function (s) {
        this.adapter.log.error(s);
    }.bind(this);
    this.log.info = function (s) {
        this.adapter.log.info(s);
    }.bind(this);
    this.getDiscoverServers();
    this.sbServer.on('register', this.init.bind(this));
}
module.exports = IoSbServer;
