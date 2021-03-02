(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("chart", [], factory);
	else if(typeof exports === 'object')
		exports["chart"] = factory();
	else
		root["chart"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdatechart"];
/******/ 	window["webpackHotUpdatechart"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "782ec25b9e55c0c97352";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.js")(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chart/bar.js":
/*!**************************!*\
  !*** ./src/chart/bar.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _components_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/data */ \"./src/components/data.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n\n// import { scaleLinear } from '../shape/scale.js';\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    this.drawMultBar();\n    this.createLabel();\n  };\n\n  drawMultBar () {\n    if (!this.config.yAxis) return;\n    if (!this.config.yAxisPart || !this.config.yAxisPart.length) {\n      this.drawBar();\n      return;\n    }\n    let yAxis = this.config.yAxis;\n    let partList = this.uniquePartList;\n    let key = this.config.yAxisPart[0].key[0];\n    let total = this.getToTalBar(yAxis);\n    let leftNum = 0;\n    for (let i = 0, len = partList.length; i < len; i++) {\n      let data = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyValueDataList\"])(this.data, key, partList[i]);\n      let height = i * this.yAxisHeight + this.topAxisHeight;\n      for (let j = 0, len = yAxis.length; j < len; j++) {\n        let keyLen = yAxis[j].key.length;\n        if (j === 0) leftNum = keyLen;\n        for (let k = 0; k < keyLen; k++) {\n          let valData = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(data, yAxis[j].key[k]);\n          let num = j === 0 ? j + k : leftNum + k;\n          this.drawShape(valData, this.leftScaleY, this.yAxisHeight, height, num, total);\n        }\n      }\n    }\n  };\n\n  drawBar () {\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    let total = this.getToTalBar(yAxis);\n    let leftNum = 0;\n    for (let i = 0; i < len; i++) {\n      let key = yAxis[i].key;\n      let keyLen = key.length;\n      if (i === 0) leftNum = keyLen;\n      for (let j = 0; j < keyLen; j++) {\n        let data = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let num = i === 0 ? i + j : leftNum + j;\n        this.drawShape(data, this.leftScaleY, this.shapeHeight, this.topAxisHeight, num, total);\n      };\n    };\n  }\n\n  drawShape (data, scaleY, height, yAxisY, num, total) {\n    let barContainer = this.middle.append('g')\n      .attr('width', this.shapeWidth)\n      .attr('height', height)\n      .attr('transform', `translate(0,${yAxisY})`);\n    let bar = barContainer.selectAll(`bar_${num}`).data(data);\n    let bandwidth = this.scaleX.bandwidth();\n    let barWidth = bandwidth / (total * 2);\n    bar.enter()\n      .append('rect')\n      .attr('class', 'bar')\n      .attr('x', (d, index) => {\n        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2);\n      })\n      .attr('y', scaleY)\n      .attr('width', barWidth)\n      .attr('height', 0)\n      .attr('fill', (d, index) => {\n        return this.colorList[index];\n      })\n      .attr('opacity', 1)\n      .transition().duration(600)\n      .attr('height', (d) => (height - scaleY(d)))\n      .attr('y', (d) => scaleY(d));\n  };\n\n  getToTalBar (yAxis) {\n    let index = 0;\n    for (let i = 0; i < yAxis.length; i++) {\n      for (let j = 0; j < yAxis[i].key.length; j++) {\n        index++;\n      }\n    }\n    return index;\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/bar.js?");

/***/ }),

/***/ "./src/chart/barLine.js":
/*!******************************!*\
  !*** ./src/chart/barLine.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _components_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/data */ \"./src/components/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n\n\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    this.drawBarLine();\n  };\n\n  drawBarLine () {\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let keys = yAxis[i].key;\n      let types = yAxis[i].type;\n      let yAxisMax = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < keys.length; j++) {\n        let data = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let chartType = types[i];\n        if (chartType === 'bar') {\n          this.drawBar(data, scaleY, i, j);\n        } else {\n          this.drawLine(data, scaleY);\n        }\n      };\n    };\n  }\n\n  drawBar (data, scaleY, i, j) {\n    let barContainer = this.middle.append('g')\n      .attr('width', this.shapeWidth)\n      .attr('height', this.shapeHeight)\n      .attr('transform', `translate(0,${this.topAxisHeight})`);\n    let bar = barContainer.selectAll('.bar').data(data);\n    let druaction = this.scaleX.bandwidth();\n    bar.enter()\n      .append('rect')\n      .attr('class', 'bar')\n      .attr('x', (d, index) => {\n        return (index * druaction) + ((i + j) * druaction / 4) + (druaction / 6);\n      })\n      .attr('y', scaleY)\n      .attr('width', druaction * 0.2)\n      .attr('height', 0)\n      .attr('fill', (d, index) => {\n        return this.colorList[index];\n      })\n      .attr('opacity', 1)\n      .transition().duration(600)\n      .attr('height', (d) => (this.shapeHeight - scaleY(d)))\n      .attr('y', (d) => scaleY(d));\n  }\n\n  drawLine (data, scaleY) {\n    // d3提供的symbols，如果用户没有提供默认为圆点\n    let symbol = d3.symbolCircle;\n    let arc = d3.symbol().type(symbol).size(2 * 25);\n    let brandWidth = this.scaleX.bandwidth();\n    let valueLine = d3.line()\n      .defined((d) => (d))\n      .x((d, index) => {\n        return brandWidth * index + brandWidth / 2;\n      })\n      .y((d) => {\n        return scaleY(d);\n      });\n    let lineContainer = this.middle.append('g')\n      .attr('transform', `translate(0,${this.topAxisHeight})`);\n    lineContainer.append('path')\n      .attr('d', valueLine(data))\n      .attr('fill', 'none')\n      .attr('stroke-width', 2)\n      .attr('stroke', '#4284f5')\n      .attr('opacity', 1);\n\n    let pointer = lineContainer.selectAll('.point-group')\n      .data(data)\n      .enter()\n      .append('g');\n\n    pointer.append('path')\n      .attr('d', arc)\n      .attr('transform', (d, index) => {\n        let x = brandWidth * index + brandWidth / 2;\n        let y = scaleY(d);\n        return `translate(${x}, ${y})`;\n      })\n      .attr('fill', '#4284f5');\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/barLine.js?");

/***/ }),

/***/ "./src/chart/barRotated.js":
/*!*********************************!*\
  !*** ./src/chart/barRotated.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _components_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/data */ \"./src/components/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n\n\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    // this.drawBar();\n  };\n\n  drawBar () {\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let key = yAxis[i].key;\n      let yAxisMax = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < key.length; j++) {\n        let data = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let barContainer = this.middle.append('g')\n          .attr('width', this.shapeWidth)\n          .attr('height', this.shapeHeight)\n          .attr('transform', `translate(0,${this.topAxisHeight})`);\n        let bar = barContainer.selectAll('.bar').data(data);\n        let druaction = this.scaleX.bandwidth();\n        bar.enter()\n          .append('rect')\n          .attr('class', 'bar')\n          .attr('x', (d, index) => {\n            return (index * druaction) + ((i + j) * druaction / 4) + (druaction / 6);\n          })\n          .attr('y', scaleY)\n          .attr('width', druaction * 0.2)\n          .attr('height', 0)\n          .attr('fill', (d, index) => {\n            return this.colorList[index];\n          })\n          .attr('opacity', 1)\n          .transition().duration(600)\n          .attr('height', (d) => (this.shapeHeight - scaleY(d)))\n          .attr('y', (d) => scaleY(d));\n      };\n    };\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/barRotated.js?");

/***/ }),

/***/ "./src/chart/base.js":
/*!***************************!*\
  !*** ./src/chart/base.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Base; });\n/* harmony import */ var _components_textTip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/textTip */ \"./src/components/textTip.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _shape_axis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/axis */ \"./src/shape/axis.js\");\n/* harmony import */ var _shape_grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shape/grid */ \"./src/shape/grid.js\");\n/* harmony import */ var _components_data_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/data.js */ \"./src/components/data.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n\n\n\n\n\n\nclass Base {\n  init () {\n    // 初始化各个部分的空间\n    this.initConfig();\n    // 初始化布局\n    this.initContainer();\n    // 初始化提示信息\n    this.tipTpl = Object(_components_textTip__WEBPACK_IMPORTED_MODULE_0__[\"initTip\"])();\n    // 生成多左轴信息\n    this.createYPart();\n    // 生成X轴\n    this.createXAxis();\n  }\n\n  render () {\n\n  }\n\n  update () {\n\n  }\n\n  getColorList () {\n\n  }\n\n  initContainer () {\n    // 图表容器\n    this.container = d3.select(`#${this.config.id}`).attr('class', 'chart-container')\n      .style('display', 'flex')\n      .style('position', 'relative')\n      .style('box-sizing', 'border-box')\n      .style('width', '100%')\n      .style('height', '100%');\n    // 左侧坐标轴容器\n    this.leftAxis = this.container.append('div').attr('class', 'left-axis')\n      .style('display', 'flex')\n      .style('flex-direction', 'row-reverse')\n      .append('svg')\n      .attr('width', this.leftAxisWidth)\n      .attr('height', this.height);\n    // 中间画图部分\n    this.middle = this.container.append('div').attr('class', 'middle')\n      .style('flex', 1)\n      .style('width', 0)\n      .style('overflow', 'auto hidden')\n      .append('svg')\n      .attr('width', this.shapeWidth)\n      .attr('height', this.height);\n    // 右侧坐标轴容器\n    this.rightAxis = this.container.append('div').attr('class', 'right-axis')\n      .style('display', 'flex')\n      .append('svg')\n      .attr('width', this.rightAxisWidth)\n      .attr('height', this.height);\n  }\n\n  initConfig () {\n    /* 初始化整个画布的宽高 */\n    const { id, autoFit, width, height } = this.config;\n    let dom = document.querySelector(`#${id}`);\n    if (autoFit) {\n      this.width = dom.clientWidth;\n      this.height = dom.clientHeight;\n    } else {\n      this.width = width;\n      this.height = height;\n      dom.style.width = `${width}px`;\n      dom.style.height = `${height}px`;\n    }\n    /* 左边坐标轴宽度 */\n    this.leftAxisWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__[\"setAsideWidth\"])(this.config.yAxis.filter(item => item.position === 'left')[0], this.data, this.config.yAxisPart);\n    /* 右边坐标轴宽度  */\n    this.rightAxisWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__[\"setAsideWidth\"])(this.config.yAxis.filter(item => item.position === 'right')[0], this.data);\n    /* X轴坐标标签的高度 */\n    this.labelHeight = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__[\"setBottomLabelHeight\"])(this.config.xAxis[0], this.data);\n    /* 底部坐标轴高度 */\n    this.bottomAxisHeight = this.labelHeight + 10;\n    /* 顶部坐标轴高度 */\n    this.topAxisHeight = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_5__[\"getTopAxisHeight\"])(this.config.xAxis);\n    /* 画布内容高度 */\n    this.shapeHeight = this.height - (this.bottomAxisHeight + this.topAxisHeight);\n    /* 画布内容的宽度 */\n    this.shapeWidth = this.width - (this.leftAxisWidth + this.rightAxisWidth);\n    /* Y坐标轴的高度 */\n    this.yAxisHeight = this.shapeHeight;\n  }\n\n  createXAxis () {\n    let xAxis = this.config.xAxis;\n    if (!xAxis.length) return;\n    let topAxisIndex = 0;\n    for (let i = 0; i < xAxis.length; i++) {\n      let xAxisList = Object(_components_data_js__WEBPACK_IMPORTED_MODULE_4__[\"getKeyDataList\"])(this.data, xAxis[i].key);\n      let scaleX = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleBand\"])(xAxisList, this.shapeWidth);\n      if (xAxis[i].position === 'top') {\n        let topAxis = topAxisIndex * 30;\n        let title = xAxis[i].title.value;\n        Object(_shape_grid__WEBPACK_IMPORTED_MODULE_3__[\"initXGrid\"])(this.middle, this.shapeWidth, this.shapeHeight, this.xAixsKey, this.topAxisHeight, topAxis, this.scaleX.bandwidth(), this.data, xAxisList, title);\n        topAxisIndex++;\n      } else {\n        this.scaleX = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleBand\"])(xAxisList, this.shapeWidth);\n        this.xAixsKey = xAxis[i].key;\n        Object(_shape_axis__WEBPACK_IMPORTED_MODULE_2__[\"initXAxis\"])(this.middle, scaleX, this.shapeWidth, this.shapeHeight, xAxis[i], this.topAxisHeight, this.bottomAxisHeight, this.labelHeight);\n      }\n    }\n  }\n\n  createYAxis (list) {\n    let yAxis = this.config.yAxis;\n    if (!yAxis.length) return;\n    for (let i = 0, len = list.length; i < len; i++) {\n      for (let j = 0; j < yAxis.length; j++) {\n        let position = yAxis[j].position;\n        let yAxisMax = Object(_components_data_js__WEBPACK_IMPORTED_MODULE_4__[\"getMaxValue\"])(this.data, yAxis[j].key);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        Object(_shape_axis__WEBPACK_IMPORTED_MODULE_2__[\"initYAxis\"])(this[`${position}Axis`], scaleY, yAxis[j], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], i);\n        if (position === 'left') {\n          this.leftScaleY = scaleY;\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_3__[\"initYGrid\"])(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, i);\n        } else {\n          this.rightScaleY = scaleY;\n        }\n      }\n    };\n  }\n\n  createYPart () {\n    let yAxisPart = this.config.yAxisPart;\n    if (!yAxisPart || !yAxisPart.length) {\n      this.createYAxis(['']);\n    } else {\n      for (let i = 0, len = yAxisPart.length; i < len; i++) {\n        let yAxisPartList = Object(_components_data_js__WEBPACK_IMPORTED_MODULE_4__[\"getKeyDataList\"])(this.data, yAxisPart[i].key);\n        let uniquePartList = [...new Set(yAxisPartList)];\n        if (i === 0) {\n          this.yAxisHeight = this.shapeHeight / uniquePartList.length;\n          this.uniquePartList = uniquePartList;\n          this.createYAxis(uniquePartList);\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_3__[\"initMiddleGrid\"])(this.middle, this.yAxisHeight, uniquePartList, this.shapeWidth, this.topAxisHeight);\n        } else {\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_3__[\"initYAxisLine\"])(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);\n        }\n        Object(_shape_grid__WEBPACK_IMPORTED_MODULE_3__[\"initYAxisGrid\"])(this.leftAxis, this.yAxisHeight, uniquePartList, this.leftAxisWidth, (len - i - 1), this.topAxisHeight, yAxisPart[0].key, this.data, i);\n      }\n    };\n  };\n\n  createLabel () {\n    let labelList = this.config.labelsList;\n    if (!labelList || !labelList.length) return;\n    for (let i = 0; i < labelList.length; i++) {\n      let key = labelList[i].key;\n      let title = labelList[i].title;\n      // let format = labelList[i].format;\n      // let textStyle = labelList[i].text;\n      this.addLabel(this.middle, key, title, this.data, this.scaleX, this.leftScaleY, this.shapeHeight);\n    };\n  }\n\n  addLabel (middle, key, title, data, scaleX, scaleY, height) {\n    let bandwidth = scaleX.bandwidth();\n    let textGroup = middle.append('g').selectAll('.label-text');\n    textGroup.data(data)\n      .enter()\n      .append('text')\n      .attr('x', (d, index) => {\n        return index * bandwidth + bandwidth / 2;\n      })\n      .attr('y', (d, index) => {\n        return scaleY(d[title]);\n      })\n      .attr('text-anchor', 'middle')\n      .text((d) => {\n        return d[key];\n      });\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/base.js?");

/***/ }),

/***/ "./src/chart/line.js":
/*!***************************!*\
  !*** ./src/chart/line.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Line; });\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n/* harmony import */ var _components_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/data */ \"./src/components/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n\n\n\nclass Line extends _base__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    this.drawLine();\n  };\n\n  drawLine () {\n    // d3提供的symbols，如果用户没有提供默认为圆点\n    let symbol = d3.symbolCircle;\n    // let rotated = 0;\n    // const symbols = {\n    //   cross: d3.symbolCross,\n    //   cross45: d3.symbolCross,\n    //   triangle: d3.symbolTriangle,\n    //   triangle180: d3.symbolTriangle,\n    //   square: d3.symbolSquare,\n    //   star: d3.symbolStar,\n    //   diamond: d3.symbolDiamond,\n    //   wye: d3.symbolWye\n    // };\n    // const rotateds = {\n    //   cross45: 45,\n    //   triangle180: 180\n    // };\n    let arc = d3.symbol().type(symbol).size(2 * 25);\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let key = yAxis[i].key;\n      let yAxisMax = Object(_components_data__WEBPACK_IMPORTED_MODULE_1__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < key.length; j++) {\n        let data = Object(_components_data__WEBPACK_IMPORTED_MODULE_1__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_2__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let brandWidth = this.scaleX.bandwidth();\n        let valueLine = d3.line()\n          .defined((d) => (d))\n          .x((d, index) => {\n            return brandWidth * index + brandWidth / 2;\n          })\n          .y((d) => {\n            return scaleY(d);\n          });\n        let lineContainer = this.middle.append('g')\n          .attr('transform', `translate(0,${this.topAxisHeight})`);\n        lineContainer.append('path')\n          .attr('d', valueLine(data))\n          .attr('fill', 'none')\n          .attr('stroke-width', 2)\n          .attr('stroke', '#4284f5')\n          .attr('opacity', 1);\n\n        let pointer = lineContainer.selectAll('.point-group')\n          .data(data)\n          .enter()\n          .append('g');\n\n        pointer.append('path')\n          .attr('d', arc)\n          .attr('transform', (d, index) => {\n            let x = brandWidth * index + brandWidth / 2;\n            let y = scaleY(d);\n            return `translate(${x}, ${y})`;\n          })\n          .attr('fill', '#4284f5');\n      };\n    };\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/line.js?");

/***/ }),

/***/ "./src/chart/map.js":
/*!**************************!*\
  !*** ./src/chart/map.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return map; });\n/* harmony import */ var _utils_check_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/check.js */ \"./src/utils/check.js\");\n\nclass map {\n  constructor (data, config) {\n    this.config = config;\n    this.data = data;\n    this.scene = null;\n    this.clickLabelLayer = null;\n    this.markerLayer = null;\n  };\n\n  render () {\n    // let idx = n.x;\n    // let idy = n.y;\n    // $$.bigContainer.append('div')\n    //   .attr('id', `${bindto.slice(1)}-${idx}-${idy}`)\n    //   .attr('style', `width: ${map_width}px; height: ${map_height}px; display: block; position: absolute;\n    //     transform: translate(${idx * width}px,  ${idy * height}px)`)\n\n    // scene = new L7.Scene({\n    //   id: `${bindto.slice(1)}-${idx}-${idy}`,\n    //   map: new L7.GaodeMap({\n    //     pitch: 0,\n    //     style: 'light',\n    //     center: [ 106.47111650000001, 34.00407302986006 ],\n    //     // center: [ 34.00407302986006, 106.47111650000001 ],\n    //     // center: [ 121.435159, 31.256971 ],\n    //     zoom: 3,\n    //     minZoom: 3\n    //   })\n    // });\n    this.scene = new L7.Scene({\n      id: 'mc_map',\n      map: new L7.GaodeMap({\n        pitch: 0,\n        style: 'light',\n        center: [106.47111650000001, 34.00407302986006],\n        // center: [ 34.00407302986006, 106.47111650000001 ],\n        // center: [ 121.435159, 31.256971 ],\n        zoom: 3,\n        minZoom: 3\n      })\n    });\n    this.scene.on('loaded', (ev) => {\n      this.fitBoundsMap();\n      this.addMapSymbols();\n      setTimeout(() => {\n        this.addMapLabels();\n      }, 100);\n      this.scene.on('zoomend', () => {\n        console.log('zoomed', this.markerLayer && this.markerLayer.markers);\n        if (this.markerLayer) {\n          this.markerLayer.markers.forEach(item => {\n            item.remove();\n          });\n          this.markerLayer && this.scene.removeMarkerLayer(this.markerLayer);\n        }\n        this.addMapLabels();\n      }); // 缩放停止时触发\n    });\n  }\n\n  fitBoundsMap () {\n    // setTimeout(() => {\n    let xAggressions = this.config.column.aggressions;\n    let yAggressions = this.config.row.aggressions;\n    let latlngs = this.data.map(v => [v[xAggressions[0]], v[yAggressions[0]]]).filter(v => !Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(v[0]) && !Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(v[1]));\n    if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"notEmpty\"])(latlngs)) {\n      let latitudeArr = latlngs.map(item => {\n        return item[0];\n      });\n      let longitudeArr = latlngs.map(item => {\n        return item[1];\n      });\n      this.scene.fitBounds([\n        [Math.min(...longitudeArr), Math.min(...latitudeArr)],\n        [Math.max(...longitudeArr), Math.max(...latitudeArr)]\n      ]);\n    }\n    // }, 300);\n  };\n\n  addMapSymbols () {\n    let tooltip = this.config.tooltipList.map(item => {\n      return item.key;\n    });\n    // let mapZoom = scene.getZoom();\n    const pointLayer = new L7.PointLayer({\n      name: 'symbol'\n    })\n      .source(this.data, {\n        parser: {\n          // 需要指定数据格式，不然默认的是geojson格式\n          type: 'json',\n          x: 'longitude',\n          y: 'latitude'\n        }\n      })\n      .shape('circle')\n      // .size(sized_feature, [1, 20])\n      .size(this.config.sizeFeature.feature, value => {\n        return this.getSize(value);\n      })\n      .style({\n        opacity: this.config.color && this.config.color.opacity,\n        strokeWidth: 0\n      });\n    if (this.config.colorFeature && this.config.colorFeature.feature) {\n      pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);\n    } else {\n      pointLayer.color('#4284F5');\n    }\n    this.scene.addLayer(pointLayer);\n    pointLayer.on('click', (ev) => {\n      if (this.scene.getLayerByName('clickLabelLayer')) {\n        this.scene.removeLayer(this.clickLabelLayer);\n      }\n      console.log('ev', ev);\n      pointLayer.setSelect(ev.featureId);\n      pointLayer.style({\n        opacity: 0.2\n      });\n      this.addClickLabel(ev, this.scene);\n    });\n    pointLayer.on('unclick', (ev) => {\n      if (this.scene.getLayerByName('clickLabelLayer')) {\n        this.scene.removeLayer(this.clickLabelLayer);\n      }\n      console.log('out', this.scene.getLayers());\n      pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);\n      pointLayer.style({\n        opacity: 1\n      });\n      pointLayer.setSelect(1000000);\n    });\n    let popupLayer = new L7.Popup({\n      closeButton: false\n    });\n    pointLayer.on('mousemove', (ev) => {\n      // if (!config.tooltip_show) return;\n      if (this.config.tooltipList.length === 0) return;\n      let tooltipData = ev.feature;\n      let obj = {};\n      for (const key in tooltipData) {\n        if (tooltip.indexOf(key) >= 0) {\n          obj[key] = tooltipData[key];\n        }\n      };\n      // var html = $$.formatTooltipText(obj);\n      let htmlContent;\n      for (const key in obj) {\n        htmlContent = htmlContent + `<div>${key}: ${obj[key]}</div>`;\n      };\n      let html = `<div>${htmlContent}</div>`;\n      popupLayer.setLnglat([ev.lngLat.lng, ev.lngLat.lat])\n        .setHTML(html);\n      this.scene.addPopup(popupLayer);\n    });\n    pointLayer.on('mouseout', (ev) => {\n      popupLayer.remove();\n    });\n  };\n\n  addMapLabels () {\n    let labeleFeatures = this.config.labelFeature.map(item => {\n      return item.feature;\n    });\n    if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(labeleFeatures)) return;\n    this.markerLayer = new L7.MarkerLayer();\n    let getMapService = this.scene.getMapService();\n    let longPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[0]);\n    let latPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[1]);\n    let symbolLayer = this.scene.getLayerByName('symbol');\n    let symbolCircle = symbolLayer.encodedData;\n    // 优化一下文本标签的显示，在文本标签太多导致重叠等等情况下\n    // 计算两个地方的半径和文本标签的长度之和，在这个范围内有其他标签的话都不显示\n    let noLabel = [];\n    let data = this.data;\n    for (let i = 0; i < data.length; i++) {\n      let v = data[i];\n      let circle = symbolCircle[i];\n      // let nextCircle = symbolCircle[i + 1];\n      let maxTxt = 0;\n      labeleFeatures.forEach((l, j) => {\n        // let txt = format_list[j].formatLabel(v[l])\n        let txt = v[l] + '';\n        maxTxt = txt.length > maxTxt ? txt.length : maxTxt;\n      });\n      let maxTxtLength = maxTxt * 8;\n      if (noLabel.indexOf(i) < 0) {\n        for (let j = i + 1; j < data.length; j++) {\n          let nextCircle = symbolCircle[j];\n          let longLength = longPixelsPerDegree * Math.abs(circle.coordinates[0] - nextCircle.coordinates[0]);\n          let latLength = latPixelsPerDegree * Math.abs(circle.coordinates[1] - nextCircle.coordinates[1]);\n          let circleLength = Math.sqrt(Math.pow(longLength, 2) + Math.pow(latLength, 2));\n          if ((maxTxtLength / 2 + circle.size / 2 + nextCircle.size / 2) > circleLength) {\n            if (noLabel.indexOf(j) < 0) {\n              noLabel.push(j);\n            }\n          }\n        }\n      }\n    }\n    for (let i = 0; i < data.length; i++) {\n      if (noLabel.indexOf(i) < 0) {\n        const divDom = document.createElement('div');\n        divDom.className = 'map-label-text';\n        divDom.style = 'display: flex; flex-direction: column; font-size: 12px; align-items: center;';\n        labeleFeatures.forEach((lf, lid) => {\n          const pDom = document.createElement('span');\n          // pDom.textContent = format_list[lid].formatLabel(data[i][lf]);\n          pDom.textContent = data[i][lf];\n          divDom.appendChild(pDom);\n        });\n        const el = document.createElement('label');\n        el.className = 'labelclass';\n        el.innerHTML = divDom.outerHTML;\n        const marker = new L7.Marker({\n          element: el\n        }).setLnglat({ lng: data[i].longitude, lat: data[i].latitude - 1 });\n        this.markerLayer.addMarker(marker);\n      }\n    }\n    this.scene.addMarkerLayer(this.markerLayer);\n  };\n\n  getSize (n) {\n    const minRadius = this.config.point.size;\n    const maxRadius = minRadius * 8;\n    const midRadius = maxRadius / 3;\n    let data = this.data;\n    let sizeRange = [];\n    let sizeFeature = this.config.sizeFeature.feature;\n    let domain = [];\n    let range = [];\n    if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeFeature)) {\n      // domain = d3.extent(data.map(v => v[sizeFeature]))\n      let featureSizeArr = data.map(v => v[sizeFeature]);\n      domain[0] = Math.min(...featureSizeArr);\n      domain[1] = Math.max(...featureSizeArr);\n      if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeRange[0]) && sizeRange[0] !== null) domain[0] = Number(sizeRange[0]);\n      if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeRange[1]) && sizeRange[1] !== null) domain[1] = Number(sizeRange[1]);\n      if (domain[0] > domain[1]) domain[0] = domain[1];\n      range = [minRadius, maxRadius];\n      if (domain[0] === domain[1]) range = [midRadius, midRadius];\n    } else {\n      range = [midRadius, midRadius];\n    }\n    // $$.userDefined_sizeRange = domain\n    // let scale = d3.scaleLinear().range(range).domain(domain).clamp(true)\n    let curSize = range[0] + ((n - domain[0]) * (range[1] - range[0]) / (domain[1] - domain[0]));\n\n    return curSize;\n    // return function(d) {\n    //   return isDefined(d) ? Math.max(scale(d), 0) : mid_radius;\n    // }\n  };\n\n  // 增加一个图层，用来显示点击某个数据时高亮，而其他数据不显示\n  addClickLabel (ev, scene) {\n    this.clickLabelLayer = new L7.PointLayer({\n      name: 'clickLabelLayer'\n    })\n      .source(this.data, {\n        parser: {\n          type: 'json',\n          x: 'longitude',\n          y: 'latitude'\n        }\n      })\n      .shape('circle')\n      .size(this.config.sizeFeature.feature, [1, 20])\n      .color(this.config.colorFeature.feature, value => {\n        if (value === ev.feature[this.config.colorFeature.feature]) {\n          return '#2A5783';\n        }\n      })\n      .style({\n        opacity: 1,\n        strokeWidth: 0\n      });\n    this.scene.addLayer(this.clickLabelLayer);\n  }\n\n/**\n  getColorList() {\n    $$.modifyColorList({\n      colored_type: colored_type,\n      colored_feature: colored_feature,\n      keys: keys\n    })\n  }\n\n  getSizeList() {\n    if(isDefined(sized_feature)) {\n      let range = d3.extent(data.sort((a, b) => a[sized_feature] - b[sized_feature]).map(d => d[sized_feature]))\n      $$.modifySizeList({\n        sizeRange: range,\n        sized_feature: sized_feature\n      })\n    }\n  }\n  */\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/map.js?");

/***/ }),

/***/ "./src/components/data.js":
/*!********************************!*\
  !*** ./src/components/data.js ***!
  \********************************/
/*! exports provided: getMaxValue, getKeyDataList, getKeyValueDataList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMaxValue\", function() { return getMaxValue; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getKeyDataList\", function() { return getKeyDataList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getKeyValueDataList\", function() { return getKeyValueDataList; });\nconst getMaxValue = (data, keyList) => {\n  let mergeList = [];\n  for (let i = 0, len = keyList.length; i < len; i++) {\n    for (let j = 0, len = data.length; j < len; j++) {\n      mergeList.push(data[j][keyList[i]]);\n    }\n  }\n  return Math.max(...mergeList);\n};\n\nconst getKeyDataList = (data, key) => {\n  let list = [];\n  for (let i = 0, len = data.length; i < len; i++) {\n    list.push(data[i][key]);\n  }\n  return list;\n};\n\nconst getKeyValueDataList = (data, key, value) => {\n  let list = [];\n  for (let i = 0, len = data.length; i < len; i++) {\n    if (data[i][key] === value) {\n      list.push(data[i]);\n    }\n  }\n  return list;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/components/data.js?");

/***/ }),

/***/ "./src/components/textTip.js":
/*!***********************************!*\
  !*** ./src/components/textTip.js ***!
  \***********************************/
/*! exports provided: initTip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initTip\", function() { return initTip; });\n\nconst initTip = () => {\n  let tipTpl = document.createElement('div');\n  tipTpl.style.padding = '4px';\n  tipTpl.style.backgroundColor = 'white';\n  tipTpl.style.fontSize = '14px';\n  tipTpl.style.color = '#424242';\n  tipTpl.style.borderRadius = '4px';\n  tipTpl.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0px 1px 3px';\n  tipTpl.style.position = 'fixed';\n  document.body.appendChild(tipTpl);\n  return tipTpl;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/components/textTip.js?");

/***/ }),

/***/ "./src/geometry/Bubble.js":
/*!********************************!*\
  !*** ./src/geometry/Bubble.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* harmony import */ var _Geometry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Geometry.js */ \"./src/geometry/Geometry.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\n\nlet { defaultFormat, defaultText } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\nclass Bubble extends _Geometry_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.init();\n    this.colorList = [];\n  }\n\n  init () {\n    this.createContainer();\n  }\n\n  labelsConfig () {\n    let list = this.config.labelsList;\n    if (list.length === 0) {\n      return;\n    }\n    let dpr = this.config.dpr || 1;\n    this.geometry.selectAll('.bubble-labels').remove();\n    let textDom = this.geometry\n      .append('text')\n      .attr('class', 'bubble-labels')\n      .attr('text-anchor', 'middle')\n      .attr('startOffset', '50%')\n      .attr('textLength', (d) => d.radius)\n      .attr(\n        'transform',\n        (d) =>\n          `translate(0, -${\n            list.reduce((a, b) => a + b.text.lineHeight, 0) / 2\n          })`\n      );\n    textDom\n      .selectAll('tspan')\n      .data((d) => {\n        let tempList = list\n          .map((l) => {\n            let { format = defaultFormat } = l;\n            return {\n              ...d,\n              key: l.key,\n              title: l.title,\n              format: l.format,\n              text: l.text || defaultText,\n              formatVal: Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"dataProcess\"])(d[l.key], format)\n            };\n          })\n          .filter((f) => Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"getTextWidth\"])(f.formatVal, f.text.fontSize + 'px') * dpr < d.radius * 2 * 0.7);\n        let totalHeight = tempList.reduce((a, b) => {\n          return a + b.text.lineHeight;\n        }, 0);\n        if (totalHeight > d.radius * 2 * 0.7) {\n          tempList = tempList.slice(0, 2);\n        }\n        return tempList;\n      })\n      .enter()\n      .append('tspan')\n      .attr('x', (d) => 0)\n      .attr('dy', (d) => `${d.text.lineHeight}px`)\n      .attr('fill', (d) => d.text.fontColor)\n      .attr('font-size', (d) => d.text.fontSize)\n      .text((d) => d.formatVal);\n  }\n\n  draw () {\n    let { size, width, height, colorFeature, orderStyle } = this.config;\n    let pack = d3.pack().size([width * size, height * size]);\n    let root = d3\n      .hierarchy({\n        children: this.data\n      })\n      .sum((d) => {\n        return d[this.config.sizeFeature.feature];\n      });\n    if (orderStyle === -1) {\n      root.sort((a, b) => b.value - a.value);\n    } else if (orderStyle === 1) {\n      root.sort((a, b) => a.value - b.value);\n    } else {\n      root.sort(() => Math.random() * 2 - 1);\n    }\n    let colorList = [];\n    var nodes = pack(root)\n      .leaves()\n      .map((d, idx) => {\n        let colorVal = colorFeature.feature;\n        let val = colorFeature.type === 'ordinal' ? d.data[colorVal] : d.value;\n        let color = this.getItemColor(idx, val);\n        if (colorFeature.feature) {\n          colorList.push({\n            val: d.data[colorFeature.feature],\n            color\n          });\n        }\n\n        return {\n          x: d.x,\n          y: d.y,\n          r: d.r,\n          color,\n          id: 'bubble-circle' + idx,\n          radius: d.r,\n          value: d.value,\n          ...d.data\n        };\n      });\n    this.colorList = colorList;\n    this.className = 'bubble-circle';\n    this.geometry = this.svg\n      .append('g')\n      .attr('class', 'bubble-wrap')\n      .attr('transform', 'translate(0,0)')\n      .selectAll('bubble-circle')\n      .data(nodes)\n      .enter()\n      .append('g')\n      .attr('id', (d) => d.id)\n      .attr('transform', (d) => `translate(${d.x},${d.y})`);\n\n    this.geometry\n      .append('circle')\n      .attr('cx', 0)\n      .attr('cy', 0)\n      .attr('r', (d) => d.r)\n      .attr('fill', (d) => d.color);\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Bubble);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Bubble.js?");

/***/ }),

/***/ "./src/geometry/Geometry.js":
/*!**********************************!*\
  !*** ./src/geometry/Geometry.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/color.js */ \"./src/utils/color.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n\n\n\nlet { defaultText, defaultFormat, fontColor } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nclass Geometry {\n  constructor (data, config) {\n    this.data = data;\n    this.config = config;\n    this.container = null;\n    this.geometry = null;\n  }\n\n  /**\n   * 创建容器\n   */\n  createContainer () {\n    let { id, width, height } = this.config;\n    this.container = d3\n      .select(`#${id}`)\n      .append('div')\n      .attr('class', 'chart-container')\n      .attr(\n        'style',\n        `width:${width}px;height:${height}px;position:relative;display:inline-block;vertical-align:middle`\n      );\n\n    // 待补充\n    this.svg = this.container\n      .append('svg')\n      .attr('width', width)\n      .attr('height', height);\n    // .attr('transform', 'translate(10,10)');\n  }\n\n  /**\n   * 标签配置\n   */\n  labelsConfig () {}\n\n  /**\n   * 提示框配置\n   */\n  tooltipConfig () {\n    if (!this.geometry) {\n      return;\n    }\n    let list = this.config.tooltipList;\n    if (list.length === 0) {\n      return;\n    }\n    // let { width, height } = this.config;\n    let tooltipWrap;\n    let style = `\n    position:absolute;\n    z-index:3;\n    transition:left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;\n    padding:8px 12px;\n    color:${fontColor};\n    background: #fff;\n  box-shadow: rgb(174, 174, 174) 0px 0px 10px;\n  border-radius: 3px;`;\n\n    this.geometry.on('mouseover', (d) => {\n      if (list.length === 0) {\n        return;\n      }\n      tooltipContentProcess(d);\n    });\n\n    this.geometry.on('mouseout', () => {\n      // this.container.selectAll('.dc-tooltip').remove();\n      d3.select('body').selectAll('.dc-tooltip').remove();\n    });\n\n    this.geometry.on('mousemove', () => {\n      let { left, top, translateX } = retLeftTop();\n      let curStyle =\n        style +\n        ` left:${left}px;top:${top}px;transform:translateX(${translateX}`;\n      // this.container.selectAll('.dc-tooltip').attr('style', curStyle);\n      d3.select('body').selectAll('.dc-tooltip').attr('style', curStyle);\n    });\n\n    function retLeftTop () {\n      let { clientWidth: tempWidth, clientHeight: tempHeight } = document.body;\n      let translateX = 0;\n      let left = event.x + 20;\n      let top = event.y + 20;\n\n      if (top + list.length * 30 > tempHeight) {\n        top = top - list.length > 0 ? top - list.length * 30 : 0;\n      }\n      if (left + 150 > tempWidth) {\n        left = left - 150 > 0 ? left - 30 : 0;\n        translateX = '-100%';\n      }\n      return {\n        left,\n        top,\n        translateX\n      };\n    }\n\n    function tooltipContentProcess (d) {\n      // 鼠标的offsetX offsetY\n      // 弹框最大高度  30 * list.length\n      // 容器的高度\n      let { left, top, translateX } = retLeftTop();\n      let curStyle =\n        style +\n        ` left:${left}px;top:${top}px;transform:translateX(${translateX})`;\n\n      tooltipWrap = d3\n        .select('body') //  this.container //\n        .append('div')\n        .attr('class', 'dc-tooltip')\n        .attr('style', curStyle);\n\n      let listItem = '';\n      list.forEach((item) => {\n        let prop = item.title;\n        let val = d[item.key];\n        let { text = defaultText, format = defaultFormat } = item;\n        if (item.display !== 'none') {\n          let curStyleObj = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"styleProcess\"])(text);\n          let retVal = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"])(val, format);\n          Object.assign(curStyleObj, {\n            display: 'inline-flex',\n            flex: 1,\n            justifyContent: 'space-between'\n          });\n          listItem += `<li class=\"dc-tooltip-list-item\" style=\"margin-bottom:4px;display:flex;align-items: center;\">\n            <span style=\"${curStyleObj}\">\n            <span >${prop}:</span>\n            <span>${retVal}</span>\n            </span>\n            </li>`;\n        }\n      });\n      tooltipWrap.html(listItem);\n    }\n  }\n\n  registerEvent (eventType) {\n    if (!this.geometry) {\n      return;\n    }\n    let that = this;\n    this.geometry.on(\n      eventType,\n      function (d) {\n        // 待修改selectAll(`.${that.className}`)\n        d3.event.stopPropagation();\n        that.geometry.attr('opacity', that.config.opacity * 0.2);\n        d3.select(this).transition().duration(500).attr('opacity', 1);\n        that.config.clkFlag = true;\n        typeof that.config.data_click === 'function' &&\n          that.config.data_click(d);\n      },\n      false\n    );\n\n    this.container.on(\n      eventType,\n      function (d) {\n        // 待修改selectAll(`.${that.className}`)\n        that.geometry.attr('opacity', that.config.opacity);\n        if (that.config.clkFlag) {\n          typeof that.config.data_click === 'function' &&\n            that.config.data_click();\n          that.config.clkFlag = false;\n        }\n      },\n      false\n    );\n  }\n\n  /**\n   * 画图形\n   */\n  render () {\n    this.draw();\n    this.labelsConfig();\n    this.tooltipConfig();\n    this.registerEvent('click');\n  }\n\n  getItemColor (index, curVal) {\n    let { type, feature } = this.config.colorFeature;\n    let min = 0;\n    let max = 0;\n    if (type === 'linear') {\n      let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n      min = sortData[0][feature];\n      max = sortData[sortData.length - 1][feature];\n      if (this.data.length === 1) {\n        if (min > 0) {\n          min = 0;\n        } else {\n          max = 0;\n        }\n      }\n    }\n\n    return Object(_utils_color_js__WEBPACK_IMPORTED_MODULE_0__[\"getItemColor\"])(\n      index,\n      this.config.colorList,\n      this.config.colorFeature.type,\n      min,\n      max,\n      curVal,\n      feature\n    );\n  }\n\n  update (type, data) {\n    let updateFun = {\n      tooltip: () => {\n        this.config.tooltipList = data;\n        this.tooltipConfig();\n      },\n      labels: () => {\n        this.config.labelsList = data;\n        this.labelsConfig();\n      }\n    };\n\n    if (typeof updateFun[type] === 'function') {\n      updateFun[type]();\n    }\n  }\n\n  getColorList () {\n    let { colorFeature, colorOpacity } = this.config;\n    if (!colorFeature.feature) {\n      return [];\n    }\n    if (!this.colorList || this.colorList.length === 0) {\n      return [];\n    }\n    let colorList = [];\n    let obj = {};\n    obj.key = colorFeature;\n    obj.opacity = colorOpacity;\n    obj.list = [];\n    obj.name = colorFeature.feature;\n    obj.colored_type = colorFeature.type;\n    /**\n     * 处理数据 取最大值和最小值\n     */\n    if (colorFeature.type === 'linear') {\n      let sortList = this.colorList\n        .filter((i) => typeof i.val !== 'undefined')\n        .sort((a, b) => a.val - b.val);\n      let minObj = sortList[0];\n      minObj.rangeType = 'min';\n      minObj.originalVal = minObj.val;\n      minObj.val = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"toScientificNotation\"])(minObj.val);\n      minObj.color = this.getItemColor(0, minObj.val);\n      let maxObj = JSON.parse(JSON.stringify(sortList[0]));\n      if (sortList.length > 1) {\n        maxObj.originalVal = sortList[sortList.length - 1].val;\n      }\n      maxObj.color = this.getItemColor(1, maxObj.originalVal);\n      maxObj.rangeType = 'max';\n      maxObj.val = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"toScientificNotation\"])(maxObj.originalVal);\n\n      obj.list = [minObj, maxObj];\n    } else {\n      obj.list = this.colorList;\n    }\n    colorList.push(obj);\n    return colorList;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Geometry);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Geometry.js?");

/***/ }),

/***/ "./src/geometry/GeometryWithAxis.js":
/*!******************************************!*\
  !*** ./src/geometry/GeometryWithAxis.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Geometry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Geometry.js */ \"./src/geometry/Geometry.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\nlet { defaultText, defaultLineStyle } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nclass GeometryWithAxis extends _Geometry_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.xScale = null;\n    this.yScale = null;\n    this.xAxisG = null;\n    this.yAxisG = null;\n  }\n\n  /**\n   * 定义比例尺\n   */\n  xScaleConfig () {\n    this.xScale = d3\n      .scaleLinear()\n      .domain(this.getMinMaxData(this.config.xAxis.title.value)); // 待修改\n    this.xScale.nice();\n  }\n\n  yScaleConfig () {\n    this.yScale = d3\n      .scaleLinear()\n      .domain(this.getMinMaxData(this.config.yAxis.title.value)); // 待修改\n    let {\n      yTitleWidth,\n      yLabelWidth,\n      xLabelWidth,\n      labelHeight,\n      titleHeight\n    } = this.getTransformData();\n\n    this.xScale\n      .range([\n        yTitleWidth + yLabelWidth + (6 + 4) * (this.config.dpr || 1),\n        this.config.width - xLabelWidth\n      ])\n      .nice();\n\n    this.yScale\n      .range([\n        this.config.height -\n          labelHeight -\n          titleHeight -\n          (6 + 4) * (this.config.dpr || 1),\n        // -  (this.xLabelWidth * 2) / 3,\n        labelHeight // + yLabelWidth / 2\n      ]) // 半个字体高度\n      .nice();\n\n    this.xAxisConfig(labelHeight, titleHeight);\n\n    this.yAxisConfig(yLabelWidth, yTitleWidth);\n\n    this.xTitleConfig(labelHeight);\n\n    this.yTitleConfig(labelHeight, titleHeight, yTitleWidth, yLabelWidth);\n\n    this.gridLineConfig();\n    this.diagonalLineConfig();\n  }\n\n  getMinMaxData (feature) {\n    if (this.data.length === 1) {\n      if (this.data[0][feature] > 0) {\n        return [0, this.data[0][feature]];\n      } else {\n        return [this.data[0][feature], 0];\n      }\n    }\n    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n    let min = sortData[0][feature];\n    let max = sortData[sortData.length - 1][feature];\n\n    return [min, max];\n  }\n\n  /**\n   *\n   */\n  getTransformData () {\n    let { hasUnit } = this.config;\n    let {\n      title: { style = defaultText, value },\n      label: { style: labelStyle = defaultText }\n    } = this.config.yAxis;\n\n    let yTitleWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(value, style.fontSize + 'px');\n    let yTicks = this.yScale.ticks();\n    let yMaxLabel = yTicks[yTicks.length - 1];\n    let yLabelWidth =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(yMaxLabel, labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n    let xTicks = this.xScale.ticks();\n    let xMaxLabel = xTicks[xTicks.length - 1];\n    let xLabelWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(xMaxLabel, labelStyle.fontSize + 'px');\n\n    if (hasUnit) {\n      yLabelWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(\n        d3.format('~s')(yMaxLabel),\n        labelStyle.fontSize + 'px'\n      );\n      xLabelWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(\n        d3.format('~s')(xMaxLabel),\n        labelStyle.fontSize + 'px'\n      );\n    }\n    let { label, title } = this.config.xAxis;\n\n    let labelHeight = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"][label.style.fontSize];\n    let titleHeight = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"][title.style.fontSize];\n    if (labelStyle.rotate === -45) {\n    } else if (labelStyle.rotate === 45) {\n      labelHeight += yLabelWidth / 2;\n    }\n    // titleHeight = titleHeight + titleHeight / 2;\n\n    this.yTitleWidth = yTitleWidth;\n    this.yLabelWidth = yLabelWidth;\n    this.xLabelWidth = xLabelWidth;\n    this.labelHeight = labelHeight;\n    this.titleHeight = titleHeight;\n    return {\n      yTitleWidth,\n      yLabelWidth,\n      xLabelWidth,\n      labelHeight,\n      titleHeight\n    };\n  }\n\n  /**\n   * 定义坐标轴\n   */\n  xAxisConfig (labelHeight, titleHeight) {\n    let {\n      hasUnit,\n      xAxis: {\n        label: { style: labelStyle = {} }\n      }\n    } = this.config;\n    let ticks = this.xScale.ticks();\n    let width =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(ticks[ticks.length - 1], labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n    let len = parseInt(Math.round(ticks.length / (this.config.width / width)));\n    len = len ? len + 1 : 1;\n    let xAxis = d3.axisBottom(this.xScale).tickFormat((d, idx) => {\n      if (idx % len === 0) {\n        let val = d;\n        if (hasUnit) {\n          val = d3.format('~s')(d);\n        }\n        return val;\n      } else {\n        return '';\n      }\n    });\n    this.xAxisG = this.svg\n      .append('g')\n      .attr('class', 'x-axis')\n      .attr(\n        'transform',\n        `translate(0,${\n          this.config.height -\n          labelHeight -\n          titleHeight -\n          (6 + 4) * (this.config.dpr || 1)\n          //  -  (this.xLabelWidth * 2) / 3\n        })`\n      );\n\n    this.xAxisG.call(xAxis);\n\n    this.setAxisStyle(this.config.xAxis, 'x');\n  }\n\n  setAxisStyle (AxisConfig, type) {\n    let {\n      tickLine: { style: tickLineStyle = defaultLineStyle },\n      line: { style: lineStyle = defaultLineStyle, show: showLine },\n      label: { style: labelStyle = defaultLineStyle }\n    } = AxisConfig;\n\n    console.log(lineStyle);\n    let AxisG = this[type + 'AxisG'];\n    let { rotate } = labelStyle;\n    let transformValue = `rotate(${rotate})`;\n    if (rotate !== 0 && rotate !== 90) {\n      if (type === 'x') {\n        transformValue += `translate(${\n          rotate < 0 ? (-this.xLabelWidth * 2) / 3 : (this.xLabelWidth * 2) / 3\n        },0)`;\n      } else {\n        transformValue += `translate(0,${\n          rotate < 0 ? -this.yLabelWidth / 4 : this.yLabelWidth / 4\n        })`;\n      }\n    } else if (rotate === 90) {\n      if (type === 'x') {\n        transformValue += `translate(${this.xLabelWidth / 2 + 7},-10)`;\n      } else {\n        transformValue += `translate(${this.yLabelWidth},${this.yLabelWidth})`;\n      }\n    }\n    AxisG.selectAll('text')\n      .attr('transform', transformValue)\n      .attr('stroke', 'none')\n      .attr('fill', labelStyle.fontColor)\n      .attr('font-size', labelStyle.fontSize)\n      .attr('font-weight', labelStyle.fontWeight)\n      .attr('font-style', labelStyle.fontStyle);\n\n    AxisG.selectAll('line')\n      .attr('stroke', tickLineStyle.fontColor)\n      .attr('stroke-opacity', tickLineStyle.opacity || 1)\n      .attr('stroke-width', tickLineStyle.lineWidth);\n\n    if (!showLine) {\n      AxisG.selectAll('path').remove();\n      return;\n    }\n    AxisG.selectAll('path')\n      .attr('stroke', lineStyle.fontColor)\n      .attr('stroke-width', lineStyle.lineWidth)\n      .attr('stroke-opacity', lineStyle.opacity)\n      .attr('stroke-dasharray', lineStyle.lineDash);\n  }\n\n  yAxisConfig (yLabelWidth, yTitleWidth) {\n    let {\n      hasUnit,\n      yAxis: {\n        label: { style: labelStyle = {} }\n      }\n    } = this.config;\n\n    let ticks = this.yScale.ticks();\n    let height =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(ticks[ticks.length - 1], labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n    if (labelStyle.rotate === 0) {\n      height = 48;\n    } else if (labelStyle.rotate === 45 || labelStyle.rotate === -45) {\n      height = height / 2;\n    }\n    let len = parseInt(\n      Math.round(ticks.length / (this.config.height / height))\n    );\n    len = len ? len + 1 : 1;\n    let yAxis = d3.axisLeft(this.yScale).tickFormat((d, idx) => {\n      if (idx % len === 0) {\n        let val = d;\n        if (hasUnit) {\n          val = d3.format('~s')(d);\n        }\n        return val;\n      } else {\n        return '';\n      }\n    });\n\n    // let yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {\n    //   if (hasUnit) {\n    //     return d3.format('~s')(d);\n    //   }\n    //   return d;\n    // });\n\n    this.yAxisG = this.svg\n      .append('g')\n      .attr('class', 'y-axis')\n      .attr(\n        'transform',\n        `translate(${\n          yLabelWidth + yTitleWidth + (6 + 4) * (this.config.dpr || 1)\n        },0)`\n      );\n\n    this.yAxisG.call(yAxis);\n\n    this.setAxisStyle(this.config.yAxis, 'y');\n  }\n\n  xTitleConfig (labelHeight) {\n    let {\n      title: { value, style = defaultText, show: showTitle }\n    } = this.config.xAxis;\n    if (!showTitle) {\n      return;\n    }\n    let xTitleWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(value, style.fontSize + 'px');\n\n    this.xAxisG\n      .append('text')\n      .attr('class', 'x-title')\n      .attr(\n        'transform',\n        `translate(${this.config.width - xTitleWidth},${\n          labelHeight + (6 + 2) * (this.config.dpr || 1) + labelHeight / 2\n          // + (this.xLabelWidth * 2) / 3\n        })`\n      )\n      .attr('stroke', 'none')\n      .attr('fill', style.fontColor)\n      .attr('font-size', style.fontSize)\n      .attr('font-weight', style.fontWeight)\n      .attr('font-style', style.fontStyle)\n      .attr('text-decoration', style.textDecoration)\n      .text(value);\n  }\n\n  yTitleConfig (labelHeight, titleHeight, yTitleWidth, yLabelWidth) {\n    let {\n      title: { style = defaultText, value, show: showTitle }\n    } = this.config.yAxis;\n    // let { style = defaultText } = title;\n    if (!showTitle) {\n      return;\n    }\n    let curHeight = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"][style.fontSize] * value.length;\n\n    this.yAxisG\n      .append('text')\n      .attr('class', 'y-title')\n      .attr(\n        'transform',\n        `translate(${\n          -yTitleWidth / 2 - yLabelWidth - (6 + 8) * (this.config.dpr || 1)\n        },${curHeight - labelHeight + labelHeight / 2 - titleHeight})`\n      )\n      .attr('writing-mode', 'tb')\n      .attr('stroke', 'none')\n      .attr('fill', style.fontColor)\n      .attr('font-size', style.fontSize)\n      .attr('font-weight', style.fontWeight)\n      .attr('font-style', style.fontStyle)\n      .attr('text-decoration', style.textDecoration)\n      .text(value);\n  }\n\n  diagonalLineConfig () {\n    let xTicks = this.xScale.ticks();\n    let yTicks = this.yScale.ticks();\n\n    let that = this;\n    that.svg\n      .append('g')\n      .attr('class', 'diagonal-line')\n      .selectAll('line')\n      .data([1])\n      .enter()\n      .append('line')\n      .attr('x1', () => that.xScale(xTicks[0]))\n      .attr('y1', () => that.yScale(yTicks[0]))\n      .attr('x2', () => that.xScale(xTicks[xTicks.length - 1]))\n      .attr('y2', () => that.yScale(yTicks[yTicks.length - 1]))\n      .attr('fill', 'none')\n      .attr('stroke', '#c2c9d1')\n      .attr('stroke-opacity', 1)\n      .attr('stroke-width', 1);\n  }\n\n  /**\n   * 网格线\n   */\n  gridLineConfig () {\n    let {\n      line: { style = {}, show }\n    } = this.config.yAxis.grid || {};\n    if (!show) {\n      return;\n    }\n    let {\n      line: { style: xLineStyle = {} }\n    } = this.config.xAxis.grid || {};\n\n    let that = this;\n    let xTicks = this.xScale.ticks();\n    let yTicks = this.yScale.ticks();\n\n    drawGridLine('y-grid-line', xTicks, style)\n      .attr('x1', (d) => that.xScale(d)) // + config.xOffset\n      .attr('x2', (d) => that.xScale(d))\n      .attr('y1', that.yScale(yTicks[0]))\n      .attr('y2', that.yScale(yTicks[yTicks.length - 1]));\n\n    drawGridLine('x-grid-line', yTicks, xLineStyle)\n      .attr('y1', (d) => that.yScale(d)) // + config.xOffset\n      .attr('y2', (d) => that.yScale(d))\n      .attr('x1', that.xScale(xTicks[0]))\n      .attr('x2', that.xScale(xTicks[xTicks.length - 1]));\n\n    function drawGridLine (className, ticks, curStyle) {\n      return that.svg\n        .append('g')\n        .attr('class', className)\n        .selectAll('line')\n        .data(ticks)\n        .enter()\n        .append('line')\n        .attr('class', 'grid-line-item')\n        .attr('stroke', curStyle.fontColor || '#c2c9d1')\n        .attr('stroke-width', curStyle.lineWidth || 1)\n        .attr('stroke-opacity', curStyle.opacity || 1)\n        .attr('stroke-dasharray', curStyle.lineDash || [0, 0])\n        .attr('fill', 'none');\n    }\n  }\n\n  draw () {}\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (GeometryWithAxis);\n\n\n//# sourceURL=webpack://chart/./src/geometry/GeometryWithAxis.js?");

/***/ }),

/***/ "./src/geometry/Scatter.js":
/*!*********************************!*\
  !*** ./src/geometry/Scatter.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _GeometryWithAxis_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GeometryWithAxis.js */ \"./src/geometry/GeometryWithAxis.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\nlet { defaultFormat, defaultText } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\n\nclass Scatter extends _GeometryWithAxis_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.colorScale = null;\n    this.init();\n  }\n\n  init () {\n    this.createContainer();\n    this.xScaleConfig();\n    this.yScaleConfig();\n    this.addCircleColorScale();\n  }\n\n  addCircleColorScale () {\n    let { feature } = this.config.sizeFeature;\n    if (!feature) {\n      return;\n    }\n    let min = 0;\n    let max = 0;\n    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n    min = sortData[0][feature];\n    max = sortData[sortData.length - 1][feature];\n    this.colorScale = d3.scaleLinear().domain([min, max]).range([10, 18]);\n  }\n\n  isExistCircle (\n    x,\n    y,\n    radius,\n    xKey,\n    yKey,\n    yTitleWidth,\n    yLabelWidth,\n    textWidth,\n    lineHeight\n  ) {\n    let match = this.data.find((i) => {\n      let minX =\n        this.xScale(i[xKey]) - radius - yTitleWidth - yLabelWidth - 6 - 2;\n      let minY = this.yScale(i[yKey]) - radius;\n      let maxY = this.yScale(i[yKey]) + radius;\n\n      if (\n        x <= minX &&\n        x + textWidth >= minX + radius * 2 &&\n        y >= minY &&\n        y <= maxY &&\n        y + lineHeight >= maxY\n      ) {\n        return i;\n      }\n      return null;\n    });\n    return !!match;\n  }\n\n  isExistInCoord (list, x, y, lineHeight) {\n    if (list.length === 0) {\n      return false;\n    }\n    let match = list.find((i) => {\n      let { x: minX, y: minY, textWidth } = i;\n      // console.log(minX, minY, textWidth);\n      if (\n        Math.abs(minX - x) < textWidth &&\n        Math.abs(minY - y) < lineHeight / 2\n      ) {\n        return i;\n      }\n\n      return null;\n    });\n    return !!match;\n  }\n\n  labelsConfig () {\n    this.geometry.selectAll('.scatter-labels').remove();\n    let yTitleWidth = this.yTitleWidth;\n    let yLabelWidth = this.yLabelWidth;\n\n    let labelHeight = this.labelHeight;\n    let titleHeight = this.titleHeight;\n    let list = this.config.labelsList;\n    if (list.length === 0) {\n      return;\n    }\n    let {\n      xAxis: { key: xKey = '' },\n      yAxis: { key: yKey = '' },\n      sizeFeature\n    } = this.config;\n    let coordList = [];\n    this.geometry\n      .selectAll('text')\n      .data((d) => {\n        let notShowCount = 0;\n        let tempList = list\n          .map((l, idx) => {\n            let { format = defaultFormat, text = defaultText } = l;\n            let radius = 16;\n            if (this.colorScale) {\n              radius = this.colorScale(d[sizeFeature.feature]);\n            }\n            let formatVal = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"])(d[l.key], format);\n            let labelX =\n              this.xScale(d[xKey]) - yTitleWidth - yLabelWidth + 8; // +radius\n\n            let labelY =\n              this.yScale(d[yKey]) + (idx - notShowCount) * text.lineHeight;\n\n            let textWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(formatVal, text.fontSize + 'px');\n            if (\n              this.isExistInCoord(coordList, labelX, labelY, text.lineHeight)\n            ) {\n              notShowCount++;\n              return null;\n            }\n            coordList.push({\n              x: labelX,\n              y: labelY,\n              textWidth\n            });\n            if (\n              !this.isExistCircle(\n                labelX,\n                labelY,\n                radius,\n                xKey,\n                yKey,\n                yTitleWidth,\n                yLabelWidth,\n                textWidth,\n                text.lineHeight\n              )\n            ) {\n              return {\n                ...d,\n                key: l.key,\n                title: l.title,\n                format: format,\n                text: text,\n                formatVal,\n                labelX,\n                labelY,\n                textWidth\n              };\n            } else {\n              notShowCount++;\n            }\n            return null;\n          })\n          .filter((f) => {\n            if (!f) {\n              return false;\n            }\n            if (\n              f.labelX + f.textWidth >\n              this.config.width - yTitleWidth - yLabelWidth - 6 - 2\n            ) {\n              return false;\n            }\n            return true;\n          });\n\n        let totalHeight = tempList.reduce((a, b) => {\n          return a + b.text.lineHeight;\n        }, this.yScale(d[yKey]));\n        let len =\n          (this.config.height -\n            labelHeight -\n            titleHeight -\n            this.yScale(d[yKey])) /\n          defaultText.lineHeight;\n\n        if (totalHeight >= this.config.height - labelHeight - titleHeight) {\n          tempList = tempList.slice(0, len);\n        }\n        return tempList;\n      })\n      .enter()\n      .append('text')\n      .attr('class', 'scatter-labels')\n      .attr('transform', (d) => `translate(${d.labelX},${d.labelY})`)\n      .attr('fill', (d) => d.text.fontColor)\n      .attr('font-size', (d) => d.text.fontSize)\n      .text((d) => d.formatVal);\n  }\n\n  draw () {\n    let {\n      xAxis: { key: xKey = '' },\n      yAxis: { key: yKey = '' },\n      colorFeature,\n      sizeFeature\n    } = this.config;\n    this.className = 'scatter-circle-item';\n    let { yTitleWidth, yLabelWidth } = this;\n    this.geometry = this.svg\n      .append('g')\n      .attr('class', 'scatter-circle-bundle')\n      .attr('transform', `translate(${yTitleWidth + yLabelWidth},${0})`)\n      .selectAll('g')\n      .data(this.data)\n      .enter()\n      .append('g')\n      .attr('class', 'scatter-circle-item');\n    let colorList = [];\n    this.geometry\n      .append('circle')\n      .attr('cx', (d) => {\n        return this.xScale(d[xKey]) - yTitleWidth - yLabelWidth - 6 - 2;\n      })\n      .attr('cy', (d) => {\n        return this.yScale(d[yKey]);\n      })\n      .attr('r', (d) => {\n        if (this.colorScale) {\n          return this.colorScale(d[sizeFeature.feature]);\n        }\n        return 16;\n      })\n      .attr('fill', (d, idx) => {\n        let feature = colorFeature ? colorFeature.feature : undefined;\n        let match = null;\n        let curIdx = idx;\n        if (feature && colorFeature.type === 'ordinal') {\n          colorList = colorList.map((i) => {\n            if (i.val === d[feature]) {\n              i.count++;\n              match = i;\n            }\n            return i;\n          });\n          curIdx = colorList.length;\n        }\n\n        if (match) {\n          return match.color;\n        }\n\n        let color = this.getItemColor(curIdx, feature && d[feature]);\n\n        colorList.push({\n          val: d[feature],\n          color,\n          index: 1\n        });\n\n        return color;\n      });\n    this.colorList = colorList;\n  }\n\n  // /**\n  //  * 画图形\n  //  */\n  // render () {\n  //   this.draw();\n  //   this.tooltipConfig();\n  //   this.registerEvent('click');\n  // }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Scatter);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Scatter.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: GeometryDrawingProcess, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GeometryDrawingProcess\", function() { return GeometryDrawingProcess; });\n/* harmony import */ var _geometry_Bubble_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry/Bubble.js */ \"./src/geometry/Bubble.js\");\n/* harmony import */ var _geometry_Scatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geometry/Scatter.js */ \"./src/geometry/Scatter.js\");\n/* harmony import */ var _chart_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chart/map.js */ \"./src/chart/map.js\");\n/* harmony import */ var _chart_bar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chart/bar.js */ \"./src/chart/bar.js\");\n/* harmony import */ var _chart_line_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chart/line.js */ \"./src/chart/line.js\");\n/* harmony import */ var _chart_barLine_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chart/barLine.js */ \"./src/chart/barLine.js\");\n/* harmony import */ var _chart_barRotated_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chart/barRotated.js */ \"./src/chart/barRotated.js\");\n\n\n\n\n\n\n\n\nlet drawClasses = {\n  bubble: _geometry_Bubble_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  scatter: _geometry_Scatter_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  map: _chart_map_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  bar: _chart_bar_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  line: _chart_line_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  barLine: _chart_barLine_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  barRotated: _chart_barRotated_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"]\n};\n\nlet GeometryDrawingProcess = function ({ config, data, chartType }) {\n  let instance = new drawClasses[chartType](data, config);\n  return {\n    draw: () => {\n      instance.render();\n    },\n    update: (type, data) => {\n      instance.update(type, data);\n    },\n    getColorList: () => {\n      return instance.getColorList();\n    }\n  };\n};\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GeometryDrawingProcess);\n\n\n//# sourceURL=webpack://chart/./src/index.js?");

/***/ }),

/***/ "./src/shape/axis.js":
/*!***************************!*\
  !*** ./src/shape/axis.js ***!
  \***************************/
/*! exports provided: setAxisLine, setAxisYTitle, setAxisLabel, setAxisY, initYAxis, initXAxis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisLine\", function() { return setAxisLine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisYTitle\", function() { return setAxisYTitle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisLabel\", function() { return setAxisLabel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisY\", function() { return setAxisY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxis\", function() { return initYAxis; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initXAxis\", function() { return initXAxis; });\n/* harmony import */ var _tip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tip */ \"./src/shape/tip.js\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\n\n// 初始化X轴\nconst initXAxis = (middle, scaleX, width, height, option, topAxisHeight, bottomAxisHeight, labelHeight) => {\n  let position = option.position;\n  let axis = getAxis(scaleX, position, 0);\n  let axisPanel = setAxisX(middle, axis, width, height, position, topAxisHeight, bottomAxisHeight);\n  setAxisLine(axisPanel, option.line.style);\n  setAxisLabel(axisPanel, option.label, scaleX.bandwidth(), _tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"], position);\n  setAxisXtitle(axisPanel, option.title, width, labelHeight);\n};\n\nconst setAxisX = (axisPanel, axis, width, height, position, topAxisHeight, bottomAxisHeight) => {\n  const posObj = {\n    bottom: height + topAxisHeight,\n    top: topAxisHeight\n  };\n  let axisX = axisPanel.append('g')\n    .attr('transform', () => {\n      return `translate(${0},${posObj[position]})`;\n    });\n  axisX.call(axis);\n  return axisX;\n};\n\nconst initYAxis = (axisYContainer, scaleY, option, tipTpl, height, topAxisHeight, width, index) => {\n  let position = option.position;\n  let axis = getAxis(scaleY, position, 0);\n  let axisPanel = setAxisY(axisYContainer, axis, position, topAxisHeight, width, index, height);\n  setAxisLine(axisPanel, option.line.style);\n  setAxisYTitle(axisYContainer, option.title, position, width, topAxisHeight, height, index);\n  setAxisLabel(axisPanel, option.label, width, tipTpl, position);\n};\n\nconst setAxisY = (axisPanel, axis, position, topAxisHeight, translateX, index, height) => {\n  let scalePanel = axisPanel.append('g');\n  scalePanel.attr('transform', () => {\n    if (position === 'right') {\n      translateX = 1;\n    }\n    return `translate(${translateX - 1},${topAxisHeight + (height * index)})`;\n  })\n    .call(axis);\n  return scalePanel;\n};\n\nconst getAxis = (scale, position, height) => {\n  const scaleObj = {\n    top: d3.axisTop(scale),\n    bottom: d3.axisBottom(scale),\n    left: d3.axisLeft(scale),\n    right: d3.axisRight(scale)\n  };\n  let axis = scaleObj[position]\n    .tickPadding(6)\n    .ticks(5)\n    .tickSizeInner(-height)\n    .tickSizeOuter(0);\n  return axis;\n};\n\nconst setAxisLine = (scalePanel, option) => {\n  scalePanel.select('path')\n    .attr('stroke-dasharray', option.lineDash.join(',')) // 虚实线\n    .attr('stroke', option.fontColor) // 坐标轴线颜色\n    .attr('stroke-width', option.lineWidth) // 坐标轴线宽度\n    .attr('opacity', option.opacity); // 坐标轴线透明度\n};\n\nconst setAxisYTitle = (axisPanel, titleOption, position, width, topAxisHeight, height, index) => {\n  let titleStyle = titleOption.style;\n  axisPanel.append('g')\n    .attr('transform', () => {\n      let translateX = 16;\n      if (position === 'right') {\n        translateX = width - 16;\n      }\n      return `translate(${translateX}, ${topAxisHeight + (height * index)})`;\n    })\n    .append('text')\n    .attr('text-anchor', 'start')\n    .attr('fill', titleStyle.fontColor) // 标题颜色\n    .attr('font-size', titleStyle.fontSize) // 标题大小\n    .text(titleOption.value) // 标题名称\n    .attr('title', titleOption.value)\n    .style('writing-mode', 'tb');\n};\n\nconst setAxisXtitle = (axisPanel, option, width, labelHeight) => {\n  let titleStyle = option.style;\n  axisPanel.append('g')\n    .append('text')\n    .attr('text-anchor', 'end')\n    .attr('transform', `translate(${width},${labelHeight || 40})`)\n    .attr('fill', titleStyle.fontColor)\n    .attr('font-size', titleStyle.fontSize)\n    .text(option.value)\n    .attr('title', option.value);\n};\n\nconst setAxisLabel = (scalePanel, option, width, textTip, position) => {\n  let labelStyle = option.style;\n  let rotate = option.rotate;\n  let allText = scalePanel.selectAll('text');\n  let fullLen = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtLen\"])(width, labelStyle.fontSize);\n  allText.attr('font-size', labelStyle.fontSize) // 标签文本大小\n    .attr('fill', labelStyle.fontColor) // 标签文本颜色\n    .attr('opacity', labelStyle.opacity) // 标签文本透明度\n    .attr('text-anchor', () => {\n      if (position === 'bottom') {\n        let obj = {\n          90: 'end',\n          0: 'middle',\n          45: 'end',\n          '-45': 'start'\n        };\n        return obj[rotate];\n      }\n    })\n    .text((d, index, node, a) => {\n      if (position === 'bottom') {\n        let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(d, labelStyle.fontSize);\n        if (len < width) {\n          return d;\n        } else {\n          return rotate !== 90 ? d.slice(0, fullLen) + '...' : d;\n        }\n      }\n      return d;\n    })\n    .on('mouseenter', (d) => {\n      let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(d, labelStyle.fontSize);\n      if (len > width) {\n        Object(_tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"])(d, true, textTip);\n      }\n    })\n    .on('mouseout', () => {\n      Object(_tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"])('', false, textTip);\n    });\n  if (position === 'bottom') {\n    allText.attr('transform', (d) => {\n      let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(d, labelStyle.fontSize) + 4;\n      const transfromObj = {\n        45: `translate(0, ${len}) rotate(45)`,\n        '-45': `translate(0, ${len}) rotate(-45)`,\n        90: `translate(0, ${len}) rotate(90)`,\n        0: 'translate(0, 5)'\n      };\n      return transfromObj[rotate];\n    });\n  } else {\n    if (rotate === 90) {\n      let offsetY = position === 'left' ? -28 : -28;\n      let offsetX = position === 'left' ? 8 : -8;\n      allText.attr('x', offsetX)\n        .attr('y', offsetY);\n    }\n    allText.attr('text-anchor', position === 'right' ? 'start' : '');\n    allText.attr('transform', `rotate(${rotate})`);\n  }\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/axis.js?");

/***/ }),

/***/ "./src/shape/grid.js":
/*!***************************!*\
  !*** ./src/shape/grid.js ***!
  \***************************/
/*! exports provided: initYGrid, initXGrid, initYAxisGrid, initMiddleGrid, initYAxisLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYGrid\", function() { return initYGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initXGrid\", function() { return initXGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxisGrid\", function() { return initYAxisGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initMiddleGrid\", function() { return initMiddleGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxisLine\", function() { return initYAxisLine; });\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\nconst initYGrid = (middle, width, height, scaleY, topAxisHeight, index) => {\n  let axis = d3.axisLeft(scaleY)\n    .tickPadding(6)\n    .ticks(5)\n    .tickSizeInner(-(width))\n    .tickSizeOuter(0);\n  let grid = middle.append('g')\n    .attr('height', height)\n    .attr('width', width)\n    .append('g')\n    .attr('transform', `translate(${0},${topAxisHeight + (index * height)})`)\n    .call(axis);\n  grid.select('path').attr('opacity', 0);\n  grid.selectAll('text')\n    .attr('opacity', 0)\n    .text((d) => {\n      return '';\n    });\n  grid.selectAll('line')\n    .attr('stroke-dasharray', '5, 5')\n    .attr('stroke', '#c2c9d1')\n    .attr('opacity', 1)\n    .attr('stroke-width', 1);\n};\n\nconst initXGrid = (middle, width, height, xAixsKey, topAxisHeight, topAxis, unitWidth, data, xAxisList, title) => {\n  let grid = middle.append('g')\n    .attr('transform', `translate(${0}, ${topAxisHeight - topAxis})`);\n  let uniqueData = [...new Set(xAxisList)];\n  let lineLen = uniqueData.length - 1;\n  let textGroup = grid.append('g').attr('class', 'top-axis-text');\n  textGroup.append('g').append('text')\n    .text(title)\n    .attr('font-size', 14)\n    .attr('transform', (d) => {\n      let translateX = (width - Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"getTxtWidth\"])(title, 14)) / 2;\n      return `translate(${translateX}, -32)`;\n    });\n\n  let xGridGroup = textGroup.selectAll('top-axis-text')\n    .data(uniqueData)\n    .enter();\n  xGridGroup.append('text')\n    .attr('transform', (d) => {\n      let pos = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setTextPos\"])(unitWidth, d, data, xAixsKey);\n      return `translate(${pos}, ${-12}) rotate(${0})`;\n    })\n    .attr('font-size', 14)\n    .text(d => d);\n  xGridGroup.append('line')\n    .attr('x1', (d) => {\n      let width = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setLinePos\"])(unitWidth, d, data, xAixsKey);\n      return width;\n    })\n    .attr('y1', -30)\n    .attr('x2', (d) => {\n      let width = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setLinePos\"])(unitWidth, d, data, xAixsKey);\n      return width;\n    })\n    .attr('y2', height)\n    .attr('opacity', (d, index) => {\n      return lineLen === index ? 0 : 1;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight, key, data, i) => {\n  let grid = leftAxis.append('g')\n    .attr('transform', `translate(${0}, ${yAxisHeight + topAxisHeight})`);\n  let lineGroup = grid.append('g').attr('class', 'top-axis-line');\n  let yGridGroup = lineGroup.selectAll('top-axis-line')\n    .data(uniqueData)\n    .enter();\n  let lineLen = uniqueData.length - 1;\n  yGridGroup.append('text')\n    .attr('transform', (d, index) => {\n      let x = xIndex * 45 + 30;\n      let isUnit = i === 0;\n      let height = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setUnitHeight\"])(yAxisHeight, d, data, key, isUnit, index);\n      let y = height - 50;\n      return `translate(${x}, ${y})`;\n    })\n    .attr('font-size', 14)\n    .attr('text-anchor', 'end')\n    .style('writing-mode', 'tb')\n    .text(d => d);\n  yGridGroup.append('line')\n    .attr('x1', (d, index) => {\n      return i * 50;\n    })\n    .attr('y1', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('x2', width)\n    .attr('y2', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('opacity', (d, index) => {\n      let opacity = lineLen === index ? 0 : 1;\n      return opacity;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initYAxisLine = (leftAxis, topAxisHeight, height, xIndex) => {\n  let grid = leftAxis.append('g').attr('class', 'line');\n  grid.append('line')\n    .attr('x1', xIndex * 50)\n    .attr('y1', topAxisHeight)\n    .attr('x2', xIndex * 50)\n    .attr('y2', topAxisHeight + height)\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initMiddleGrid = (middle, yAxisHeight, uniqueData, width, topAxisHeight) => {\n  let grid = middle.append('g')\n    .attr('transform', `translate(${0}, ${topAxisHeight + yAxisHeight})`);\n  let lineGroup = grid.append('g').attr('class', 'top-axis-line');\n  let yGridGroup = lineGroup.selectAll('top-axis-line')\n    .data(uniqueData)\n    .enter();\n  let lineLen = uniqueData.length - 1;\n  yGridGroup.append('line')\n    .attr('x1', 0)\n    .attr('y1', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('x2', width)\n    .attr('y2', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('opacity', (d, index) => {\n      return index === lineLen ? 0 : 1;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/grid.js?");

/***/ }),

/***/ "./src/shape/scale.js":
/*!****************************!*\
  !*** ./src/shape/scale.js ***!
  \****************************/
/*! exports provided: scaleLinear, scaleBand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scaleLinear\", function() { return scaleLinear; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scaleBand\", function() { return scaleBand; });\nconst scaleLinear = (maxValue, height) => {\n  let scale = d3.scaleLinear()\n    .domain([0, maxValue * 1.1])\n    .range([height, 0])\n    .nice();\n  return scale;\n};\n\nconst scaleBand = (data, barWidth) => {\n  let scale = d3.scaleBand()\n    .domain(data)\n    .range([0, barWidth]);\n  return scale;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/scale.js?");

/***/ }),

/***/ "./src/shape/tip.js":
/*!**************************!*\
  !*** ./src/shape/tip.js ***!
  \**************************/
/*! exports provided: tipTpl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"tipTpl\", function() { return tipTpl; });\nconst tipTpl = (text, flag, textTip) => {\n  if (!textTip) return '';\n  console.log(textTip);\n  textTip.innerText = text;\n  textTip.style.display = flag ? '' : 'none';\n  textTip.style.left = (d3.event.clientX + 10) + 'px';\n  textTip.style.top = (d3.event.clientY + 10) + 'px';\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/tip.js?");

/***/ }),

/***/ "./src/utils/check.js":
/*!****************************!*\
  !*** ./src/utils/check.js ***!
  \****************************/
/*! exports provided: isArray, isEmpty, isNumber, isObject, isObjectType, isString, isUndefined, notEmpty, hasKey, getTextWidth */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isArray\", function() { return isArray; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isEmpty\", function() { return isEmpty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isNumber\", function() { return isNumber; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isObject\", function() { return isObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isObjectType\", function() { return isObjectType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isString\", function() { return isString; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isUndefined\", function() { return isUndefined; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"notEmpty\", function() { return notEmpty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hasKey\", function() { return hasKey; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextWidth\", function() { return getTextWidth; });\nconst isString = v => typeof v === 'string';\nconst isNumber = v => typeof v === 'number';\nconst isUndefined = v => typeof v === 'undefined';\nconst isObjectType = v => typeof v === 'object';\nconst isEmpty = o => (\n  isUndefined(o) || o === null ||\n    (isString(o) && o.length === 0) ||\n    (isObjectType(o) && Object.keys(o).length === 0)\n);\nconst notEmpty = o => !isEmpty(o);\n\nconst isArray = arr => arr && arr.constructor === Array;\n\nconst isObject = obj => obj && !obj.nodeType && isObjectType(obj) && !isArray(obj);\n\nconst hasKey = (dict, key) => {\n  let found = false;\n  Object.keys(dict).includes(key) && (found = true);\n  return found;\n};\n\n// 字符宽度\nlet getTextWidth = function (text, font) {\n  // re-use canvas object for better performance\n  var canvas = document.createElement('canvas');\n  var context = canvas.getContext('2d');\n  context.font = font;\n  var metrics = context.measureText(text);\n  return metrics.width;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/check.js?");

/***/ }),

/***/ "./src/utils/color.js":
/*!****************************!*\
  !*** ./src/utils/color.js ***!
  \****************************/
/*! exports provided: getItemColor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getItemColor\", function() { return getItemColor; });\n/* harmony import */ var _defaultConfig_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n\nlet { colorSet } = _defaultConfig_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\nlet getItemColor = function (\n  index,\n  colorList,\n  colorFeatureType = 'ordinal',\n  minVal,\n  maxVal,\n  curVal,\n  feature\n) {\n  let colorProcess = (function () {\n    return {\n      getOrdinalItemColor: function () {\n        if (!feature) {\n          return colorSet.category[0];\n        }\n        if (colorList && colorList.length > 0) {\n          let match = colorList.find(i => i.val === curVal);\n          if (match) {\n            return match.color;\n          }\n        }\n        colorList = colorSet.category;\n        if (colorList.length <= index) {\n          return colorList[index % colorList.length];\n        }\n        return colorList[index];\n      },\n      getLinearItemColor: function () {\n        colorList = colorList && colorList.length > 0 ? colorList : colorSet.numeric;\n        let startColor = d3.rgb(colorList[0]);\n        let endColor = d3.rgb(colorList[1]);\n        let compute = d3.interpolate(startColor, endColor);\n        return compute((curVal - minVal) / (maxVal - minVal));\n      }\n    };\n  })();\n  let funName =\n    'get' +\n    colorFeatureType.slice(0, 1).toUpperCase() +\n    colorFeatureType.slice(1) +\n    'ItemColor';\n\n  if (typeof colorProcess[funName] === 'function') {\n    return colorProcess[funName]();\n  }\n  return ''; // 随便\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/color.js?");

/***/ }),

/***/ "./src/utils/defaultConfig.js":
/*!************************************!*\
  !*** ./src/utils/defaultConfig.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  fontColor: '#6b6b6b',\n  colorSet: {\n    category: [\n      '#4284F5',\n      '#03B98C',\n      '#FACC14',\n      '#F5282D',\n      '#8543E0',\n      '#3FAECC',\n      '#3110D0',\n      '#E88F00',\n      '#DE2393',\n      '#91BA38',\n      '#99B4BF',\n      '#216A58',\n      '#AB9438',\n      '#F4999B',\n      '#C9BFE1',\n      '#055166',\n      '#1F135A',\n      '#43140A',\n      '#96005A',\n      '#8D8D8D'\n    ], // 分类特征默认颜色\n    numeric: ['#7AC9F5', '#2A5783']\n  },\n  defaultText: {\n    fontColor: '#6b6b6b',\n    fontSize: 12,\n    textAlign: 'left',\n    lineHeight: 24,\n    display: 'auto',\n    fontWeight: 'normal',\n    fontStyle: 'normal',\n    textDecoration: 'none'\n  },\n  defaultFormat: {\n    selectFormat: -1,\n    decimal: 2,\n    negative: '-1',\n    unit: '',\n    prefix: '',\n    suffix: '',\n    zone: 'CN',\n    useThousandMark: true\n  },\n  defaultLineStyle: {\n    lineWidth: 1,\n    fontColor: '#c2c9d1',\n    opacity: 1,\n    lineDash: [0, 0],\n    fontSize: 12,\n    fontWeight: 'normal',\n    fontStyle: 'normal'\n  }\n});\n\n\n//# sourceURL=webpack://chart/./src/utils/defaultConfig.js?");

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! exports provided: getTextLegend, dataProcess, styleProcess, toScientificNotation, getTextWidth, fontSizeLineHeightPair, setTextPos, setLinePos, getTxtLen, getTxtWidth, getTopAxisHeight, setAsideWidth, setBottomLabelHeight, setUnitHeight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextLegend\", function() { return getTextLegend; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dataProcess\", function() { return dataProcess; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"styleProcess\", function() { return styleProcess; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toScientificNotation\", function() { return toScientificNotation; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextWidth\", function() { return getTextWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fontSizeLineHeightPair\", function() { return fontSizeLineHeightPair; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setTextPos\", function() { return setTextPos; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setLinePos\", function() { return setLinePos; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTxtLen\", function() { return getTxtLen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTxtWidth\", function() { return getTxtWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTopAxisHeight\", function() { return getTopAxisHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAsideWidth\", function() { return setAsideWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setBottomLabelHeight\", function() { return setBottomLabelHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setUnitHeight\", function() { return setUnitHeight; });\n/* harmony import */ var _components_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/data */ \"./src/components/data.js\");\n\n\nconst getTextLegend = (text, fontSize) => {\n  let textLen = String(text).length;\n  return (textLen * fontSize) / 2 + fontSize;\n};\n\nlet dataProcess = function (val, format) {\n  if (!val) {\n    return;\n  }\n  let ret = val;\n  if (format.decimal) {\n    if (format.isPercent) {\n      ret = ret * 100;\n    }\n    ret = ret.toFixed(format.decimal);\n    if (format.isPercent) {\n      ret = ret + '%';\n    }\n  }\n\n  ret = unitProcess(ret, format.unit);\n\n  ret = displayFormatProcess(ret, format.format, format.zone);\n  ret = prefSuffixProcess(ret, format.prefix, format.suffix, format.isPercent);\n  return ret;\n};\n\nlet unitProcess = function (val, unit, micrometerFlag) {\n  let unitPare = {\n    'K 千': 1000,\n    'M 百万': 1000000,\n    'G 十亿': 1000000000,\n    'T 千亿': 100000000000\n  };\n  if (!unit) {\n    return val;\n  }\n  let ret = val / unitPare[unit];\n  return micrometerProcess(ret, micrometerFlag) + unit;\n};\n\nlet displayFormatProcess = function (val, format, zone) {\n  if (!format) {\n    return val;\n  }\n  if (format === 'percent') {\n    return val * 100 + '%';\n  }\n  let formatPare = {\n    CN: '￥',\n    JP: '¥',\n    HK: 'HK$',\n    US: '＄',\n    EUR: '€',\n    GBP: '£'\n  };\n  return formatPare[zone] + val;\n};\n\nlet prefSuffixProcess = function (val, prefix, suffix, isPercent) {\n  if (prefix) {\n    val = prefix + val;\n  }\n  if (suffix && !isPercent) {\n    val = val + suffix;\n  }\n  return val;\n};\n\nlet micrometerProcess = function (val, flag) {\n  if (!flag || val < 1000) {\n    return val;\n  }\n  let ret = '';\n  for (let i = 0; i < val.length; i++) {\n    ret += val[i];\n    if (i % 3 === 2) {\n      ret += ',';\n    }\n  }\n  return parseFloat(ret);\n};\n\nlet styleProcess = function (styleObj) {\n  return ` textAlign: ${styleObj.align};\n  color:  ${styleObj.fontColor};\n  fontSize:  ${styleObj.fontSize + 'px'};\n  fontStyle:  ${styleObj.fontStyle};\n  lineHeight:  ${styleObj.lineHeight + 'px'};\n  letterSpacing:  ${styleObj.letterSpacing + 'px'}`;\n};\n\nlet toScientificNotation = function (val) {\n  if (!val) {\n    return;\n  }\n  let ret = val.toString();\n  if (ret.length <= 4) {\n    return ret;\n  } else if (ret.length <= 6) {\n    return (ret / 1000).toFixed(2) + 'k';\n  } else if (ret.length <= 9) {\n    return (ret / 1000000).toFixed(2) + 'm';\n  } else {\n    return (ret / 1000000000).toFixed(2) + 'g';\n  }\n};\n\nlet getTextWidth = function (str, font) {\n  let canvas = document.createElement('canvas');\n  var context = canvas.getContext('2d');\n  context.font = font || '12px sans-serif';\n  let { width } = context.measureText(str);\n  return width;\n};\n\nlet fontSizeLineHeightPair = {\n  8: 12,\n  9: 12,\n  10: 12,\n  12: 18,\n  14: 20,\n  16: 24,\n  18: 26,\n  20: 30,\n  24: 34,\n  28: 36,\n  30: 40,\n  32: 44,\n  36: 54,\n  40: 56,\n  48: 60,\n  56: 64,\n  64: 72,\n  72: 88\n};\n\nconst hasValue = (arr, key, value) => {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i][key] === value) {\n      return true;\n    }\n  }\n  return false;\n};\n\nconst uniqueKeyArr = (key, list) => {\n  let arr = [];\n  for (let i = 0, len = list.length; i < len; i++) {\n    if (!hasValue(arr, key, list[i][key])) {\n      arr.push(list[i]);\n    }\n  }\n  return arr;\n};\n\nconst setUnitHeight = (height, text, data, axisKey, isUnit, index) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0, len = arr.length; i < len; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  return isUnit ? num * height * index : (height * start) + (num * height - getTxtWidth(text, 14)) / 2;\n};\n\nconst setTextPos = (width, text, data, axisKey) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0; i < arr.length; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  return (width * start) + ((width * num - getTxtWidth(text, 14)) / 2);\n};\n\nconst setLinePos = (width, text, data, axisKey) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0; i < arr.length; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  return (width * start) + (width * num);\n};\n\nconst getTxtLen = (width, font) => {\n  let textDom = document.createElement('div');\n  textDom.style.width = width + 'px';\n  textDom.style.fontSize = font + 'px';\n  textDom.style.overflowX = 'auto';\n  textDom.style.whiteSpace = 'nowrap';\n  let txt = '';\n  for (let i = 0; i < width; i++) {\n    txt = txt + '哈';\n    textDom.innerText = txt;\n    document.body.appendChild(textDom);\n    if (textDom.scrollWidth >= width) {\n      document.body.removeChild(textDom);\n      return { limit: i, space: 1 };\n    };\n    document.body.removeChild(textDom);\n  }\n\n  return -1;\n};\n\nconst getTxtWidth = (text, font) => {\n  let textDom = document.createElement('span');\n  textDom.innerText = text;\n  textDom.style.fontSize = font + 'px';\n  textDom.style.position = 'fixed';\n  document.body.appendChild(textDom);\n  let width = textDom.clientWidth;\n  document.body.removeChild(textDom);\n  return width;\n};\n\nconst getTopAxisHeight = (xAxis) => {\n  if (xAxis.length === 1) return 16;\n  else return (xAxis.length - 1) * 32 + 16;\n};\n\nconst setAsideWidth = (yAxis, data, yAxisPart) => {\n  if (!yAxis) return 16;\n  let maxValue = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(data, yAxis.key);\n  let txtLen = getTxtWidth(String(maxValue), 14) + 20;\n  let titleLen = getTxtWidth('哈', 16);\n  if (!yAxisPart) return txtLen + titleLen;\n  return yAxisPart.length * 50 + txtLen + titleLen;\n};\n\nconst setBottomLabelHeight = (xAxis, data) => {\n  let xData = Object(_components_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(data, xAxis.key);\n  let longest = xData.reduce((a, b) => a.length > b.length ? a : b);\n  let txtLen = getTxtWidth(longest) + 16;\n  let rotate = xAxis.label.rotate;\n  if (rotate !== 0) {\n    return txtLen;\n  }\n  return 42;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/utils.js?");

/***/ })

/******/ });
});