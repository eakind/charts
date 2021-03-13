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
/******/ 	var hotCurrentHash = "93445a82b67b0d4071c7";
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/data */ \"./src/utils/data.js\");\n/* harmony import */ var _utils_defaultConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/defaultConfig */ \"./src/utils/defaultConfig.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n/* eslint-disable no-unreachable */\n\n\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.init();\n  };\n\n  drawCanvas (list, index, yAxisChild) {\n    if (!list) {\n      this.drawBar(yAxisChild, index);\n      return;\n    }\n    let key = this.config.yAxisPart[0].key[0];\n    let leftNum = 0;\n    let total = this.getToTalBar(yAxisChild);\n    for (let i = 0, len = list.length; i < len; i++) {\n      let data = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyValueDataList\"])(this.data[index], key, list[i]);\n      let height = i * this.yAxisHeight + this.topAxisHeight;\n      for (let j = 0, len = yAxisChild.length; j < len; j++) {\n        let keyLen = yAxisChild[j].key.length;\n        if (j === 0) leftNum = keyLen;\n        for (let k = 0; k < keyLen; k++) {\n          let valData = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(data, yAxisChild[j].key[k]);\n          let num = j === 0 ? j + k : leftNum + k;\n          this.drawShape(valData, this.leftScaleY, this.yAxisHeight, height, num, total);\n          this.drawLabel(valData, this.leftScaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);\n        }\n      }\n    }\n  }\n\n  drawCombinedCanvas (list, index, yAxisChild, dataIndex) {\n    let height = index * this.yAxisHeight + this.topAxisHeight;\n    let len = yAxisChild.length;\n    let total = this.getToTalBar(yAxisChild);\n    let leftNum = 0;\n    let data = this.data[dataIndex];\n    for (let i = 0; i < len; i++) {\n      let key = yAxisChild[i].key;\n      let keyLen = key.length;\n      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;\n      if (i === 0) leftNum = keyLen;\n      for (let j = 0; j < keyLen; j++) {\n        let list = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(data, yAxisChild[i].key[j]);\n        let num = i === 0 ? i + j : leftNum + j;\n        this.drawShape(list, scaleY, this.yAxisHeight, height, num, total);\n        this.drawLabel(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);\n      };\n    }\n  }\n\n  drawBar (yAxisChild, index) {\n    let len = yAxisChild.length;\n    let total = this.getToTalBar(yAxisChild);\n    let leftNum = 0;\n    let data = this.data[index];\n    for (let i = 0; i < len; i++) {\n      let key = yAxisChild[i].key;\n      let keyLen = key.length;\n      let scaleY = yAxisChild[i].position === 'left' ? this.leftScaleY : this.rightScaleY;\n      if (i === 0) leftNum = keyLen;\n      for (let j = 0; j < keyLen; j++) {\n        let list = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(data, yAxisChild[i].key[j]);\n        let num = i === 0 ? i + j : leftNum + j;\n        this.drawShape(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total);\n        this.drawLabel(list, scaleY, this.yAxisHeight, this.topAxisHeight, num, total, index);\n      };\n    };\n  }\n\n  drawLabel (data, scaleY, height, topAxisHeight, num, total, index) {\n    return '';\n    let labelContainer = this.middle.append('g');\n    let label = labelContainer.selectAll(`label_${num}`).data(data);\n    let bandwidth = this.scaleX.bandwidth();\n    let barWidth = bandwidth / (total * 2);\n    label.enter()\n      .append('text')\n      .attr('text-anchor', 'middle')\n      .attr('class', 'label')\n      .attr('x', (d, index) => {\n        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2) + barWidth / 2;\n      })\n      .attr('y', d => scaleY(d) + height * index)\n      .text(d => d);\n  };\n\n  drawShape (data, scaleY, height, topAxisHeight, num, total) {\n    let barContainer = this.middle.append('g')\n      .attr('transform', `translate(0,${topAxisHeight})`);\n    let bar = barContainer.selectAll(`bar_${num}`).data(data);\n    let bandwidth = this.scaleX.bandwidth();\n    let barWidth = bandwidth / (total * 2);\n    bar.enter()\n      .append('rect')\n      .attr('class', 'bar')\n      .attr('x', (d, index) => {\n        return (index * bandwidth) + (num * (barWidth + 1)) + barWidth * (total / 2);\n      })\n      .attr('y', scaleY)\n      .attr('width', barWidth)\n      .attr('height', 0)\n      .attr('fill', (d, index) => {\n        return _utils_defaultConfig__WEBPACK_IMPORTED_MODULE_1__[\"default\"].colorSet.category[index];\n      })\n      .attr('opacity', 1)\n      .transition().duration(600)\n      .attr('height', (d) => (height - scaleY(d)))\n      .attr('y', (d) => scaleY(d));\n  };\n\n  getToTalBar (yAxis) {\n    let index = 0;\n    for (let i = 0; i < yAxis.length; i++) {\n      for (let j = 0; j < yAxis[i].key.length; j++) {\n        index++;\n      }\n    }\n    return index;\n  };\n\n  render () {\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/bar.js?");

/***/ }),

/***/ "./src/chart/barLine.js":
/*!******************************!*\
  !*** ./src/chart/barLine.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/data */ \"./src/utils/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n\n\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    this.drawBarLine();\n  };\n\n  drawBarLine () {\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let keys = yAxis[i].key;\n      let types = yAxis[i].type;\n      let yAxisMax = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < keys.length; j++) {\n        let data = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let chartType = types[i];\n        if (chartType === 'bar') {\n          this.drawBar(data, scaleY, i, j);\n        } else {\n          this.drawLine(data, scaleY);\n        }\n      };\n    };\n  }\n\n  drawBar (data, scaleY, i, j) {\n    let barContainer = this.middle.append('g')\n      .attr('width', this.shapeWidth)\n      .attr('height', this.shapeHeight)\n      .attr('transform', `translate(0,${this.topAxisHeight})`);\n    let bar = barContainer.selectAll('.bar').data(data);\n    let druaction = this.scaleX.bandwidth();\n    bar.enter()\n      .append('rect')\n      .attr('class', 'bar')\n      .attr('x', (d, index) => {\n        return (index * druaction) + ((i + j) * druaction / 4) + (druaction / 6);\n      })\n      .attr('y', scaleY)\n      .attr('width', druaction * 0.2)\n      .attr('height', 0)\n      .attr('fill', (d, index) => {\n        return this.colorList[index];\n      })\n      .attr('opacity', 1)\n      .transition().duration(600)\n      .attr('height', (d) => (this.shapeHeight - scaleY(d)))\n      .attr('y', (d) => scaleY(d));\n  }\n\n  drawLine (data, scaleY) {\n    // d3提供的symbols，如果用户没有提供默认为圆点\n    let symbol = d3.symbolCircle;\n    let arc = d3.symbol().type(symbol).size(2 * 25);\n    let brandWidth = this.scaleX.bandwidth();\n    let valueLine = d3.line()\n      .defined((d) => (d))\n      .x((d, index) => {\n        return brandWidth * index + brandWidth / 2;\n      })\n      .y((d) => {\n        return scaleY(d);\n      });\n    let lineContainer = this.middle.append('g')\n      .attr('transform', `translate(0,${this.topAxisHeight})`);\n    lineContainer.append('path')\n      .attr('d', valueLine(data))\n      .attr('fill', 'none')\n      .attr('stroke-width', 2)\n      .attr('stroke', '#4284f5')\n      .attr('opacity', 1);\n\n    let pointer = lineContainer.selectAll('.point-group')\n      .data(data)\n      .enter()\n      .append('g');\n\n    pointer.append('path')\n      .attr('d', arc)\n      .attr('transform', (d, index) => {\n        let x = brandWidth * index + brandWidth / 2;\n        let y = scaleY(d);\n        return `translate(${x}, ${y})`;\n      })\n      .attr('fill', '#4284f5');\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/barLine.js?");

/***/ }),

/***/ "./src/chart/barRotated.js":
/*!*********************************!*\
  !*** ./src/chart/barRotated.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Bar; });\n/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/data */ \"./src/utils/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n\n\n\nclass Bar extends _base__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    // this.drawBar();\n  };\n\n  drawBar () {\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let key = yAxis[i].key;\n      let yAxisMax = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < key.length; j++) {\n        let data = Object(_utils_data__WEBPACK_IMPORTED_MODULE_0__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_1__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let barContainer = this.middle.append('g')\n          .attr('width', this.shapeWidth)\n          .attr('height', this.shapeHeight)\n          .attr('transform', `translate(0,${this.topAxisHeight})`);\n        let bar = barContainer.selectAll('.bar').data(data);\n        let druaction = this.scaleX.bandwidth();\n        bar.enter()\n          .append('rect')\n          .attr('class', 'bar')\n          .attr('x', (d, index) => {\n            return (index * druaction) + ((i + j) * druaction / 4) + (druaction / 6);\n          })\n          .attr('y', scaleY)\n          .attr('width', druaction * 0.2)\n          .attr('height', 0)\n          .attr('fill', (d, index) => {\n            return this.colorList[index];\n          })\n          .attr('opacity', 1)\n          .transition().duration(600)\n          .attr('height', (d) => (this.shapeHeight - scaleY(d)))\n          .attr('y', (d) => scaleY(d));\n      };\n    };\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/barRotated.js?");

/***/ }),

/***/ "./src/chart/base.js":
/*!***************************!*\
  !*** ./src/chart/base.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Base; });\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n/* harmony import */ var _shape_axis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shape/axis */ \"./src/shape/axis.js\");\n/* harmony import */ var _shape_grid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/grid */ \"./src/shape/grid.js\");\n/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/data */ \"./src/utils/data.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n// import { initTip } from '../components/textTip';\n\n\n\n\n\nclass Base {\n  init () {\n    // 初始化X轴的空间\n    this.initXAxisConfig();\n    // 设置画图容器大小\n    this.setBaseContainer();\n    // 初始化布局\n    this.initContainer();\n  }\n\n  initXAxisConfig () {\n    /* X轴底部坐标的数据 */\n    this.xAxisList = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getKeyDataList\"])(this.data[0], this.config.xAxis[0].key);\n    /* X轴坐标标签的高度 */\n    this.labelHeight = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"setBottomLabelHeight\"])(this.config.xAxis[0], this.xAxisList);\n    console.log(this.labelHeight);\n    /* 底部坐标轴高度 */\n    this.bottomAxisHeight = this.labelHeight + 10;\n    /* 顶部坐标轴高度 */\n    this.topAxisHeight = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"getTopAxisHeight\"])(this.config.xAxisPart);\n  };\n\n  setBaseContainer () {\n    /* 判断是否自适应宽高，设置画图空间 */\n    const { id, autoFit, fitWidth, fitHeight, width, height } = this.config;\n    let dom = document.querySelector(`#${id}`);\n    let domWidth = dom.clientWidth;\n    let domHeight = dom.clientHeight;\n    this.width = fitWidth || autoFit ? domWidth : width;\n    this.height = fitHeight || autoFit ? domHeight : height;\n    dom.style.width = `${this.width}px`;\n    dom.style.height = `${this.height}px`;\n  }\n\n  initContainer () {\n    let { yAxis, isCombined } = this.config;\n    if (isCombined) {\n      // 创建合并坐标轴画布\n      this.createCombinedCanvas(yAxis);\n      return;\n    }\n    // 一共有多少个子画布\n    this.yAxisLen = yAxis.length;\n    // 每个子画布的高度\n    this.canvasHeight = Math.floor(this.height / this.yAxisLen);\n    for (let i = 0; i < this.yAxisLen; i++) {\n      // 初始化Y轴配置\n      this.initYAxisConfig(yAxis[i], i);\n      // 初始化单个画布容器\n      this.initCanvasContainer(i);\n      // 创建底部X轴\n      this.createBottomXAxis();\n      // 创建顶部X轴\n      this.createXPart();\n      // 创建Y轴并画图\n      this.createYPart(yAxis[i], i);\n    };\n  }\n\n  createCombinedCanvas (yAxis) {\n    this.yAxisLen = yAxis.length;\n    this.canvasHeight = this.height;\n    this.initCombinedYAxisConfig(yAxis);\n    this.initCanvasContainer(0);\n    this.createBottomXAxis();\n    // 创建顶部X轴\n    this.createXPart();\n    this.createCombinedYPart(yAxis);\n  }\n\n  // 初始化单个画布容器\n  initCanvasContainer (index) {\n    // 图表容器\n    this.container = d3.select(`#${this.config.id}`).append('div').attr('class', `chart-container-${index}`)\n      .style('display', 'flex')\n      .style('position', 'relative')\n      .style('box-sizing', 'border-box')\n      .style('width', '100%')\n      .style('height', `${this.canvasHeight}px`);\n    this.leftAxis = this.container.append('div').attr('class', `left-axis-${index}`)\n      .style('display', 'flex')\n      .style('flex-direction', 'row-reverse')\n      .append('svg')\n      .attr('width', this.leftAxisWidth)\n      .attr('height', this.canvasHeight);\n    // 中间画图部分\n    this.middle = this.container.append('div').attr('class', `middle-${index}`)\n      .style('flex', 1)\n      .style('width', 0)\n      .style('overflow', 'auto hidden')\n      .append('svg')\n      .attr('width', this.shapeWidth)\n      .attr('height', this.canvasHeight);\n    // 右侧坐标轴容器\n    this.rightAxis = this.container.append('div').attr('class', `right-axis-${index}`)\n      .style('display', 'flex')\n      .append('svg')\n      .attr('width', this.rightAxisWidth)\n      .attr('height', this.canvasHeight);\n  }\n\n  initCombinedYAxisConfig (yAxis) {\n    let { leftMaxValue, leftAxisWidth } = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"getMaxValueWidth\"])(yAxis, this.data, this.config.yAxisPart, 'left');\n    /* 左边坐标轴最大值 */\n    this.leftMaxValue = leftMaxValue;\n    /* 左边坐标轴宽度 */\n    this.leftAxisWidth = leftAxisWidth;\n    let { rightMaxValue, rightAxisWidth } = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"getMaxValueWidth\"])(yAxis, this.data, this.config.yAxisPart, 'right');\n    /* 右边坐标轴最大值 */\n    this.rightMaxValue = rightMaxValue;\n    this.rightAxisWidth = rightAxisWidth;\n    /* 画布内容高度 */\n    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);\n    /* 画布内容的宽度 */\n    this.shapeWidth = this.width - (this.leftAxisWidth + this.rightAxisWidth);\n    /* Y坐标轴的高度 */\n    this.yAxisHeight = this.shapeHeight;\n  };\n\n  initYAxisConfig (yAxisChild, index) {\n    /* 左边轴数组 */\n    this.leftAxisList = yAxisChild.filter(item => item.position === 'left');\n    /* 右边轴数组 */\n    this.rightAxisList = yAxisChild.filter(item => item.position === 'right');\n    /* 左边轴最大值 */\n    if (this.leftAxisList.length) {\n      this.leftMaxValue = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getMaxValue\"])(this.data[index], this.leftAxisList[0].key);\n    }\n    /* 右边轴最大值 */\n    if (this.rightAxisList.length) {\n      this.rightMaxValue = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getMaxValue\"])(this.data[index], this.rightAxisList[0].key);\n    }\n    /* 左边坐标轴宽度 */\n    this.leftAxisWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"setAsideWidth\"])(this.leftAxisList[0], this.leftMaxValue, this.config.yAxisPart);\n    /* 右边坐标轴宽度  */\n    this.rightAxisWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_4__[\"setAsideWidth\"])(this.rightAxisList[0], this.leftMaxValue);\n    /* 画布内容高度 */\n    this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);\n    /* 画布内容的宽度 */\n    this.shapeWidth = this.width - (this.leftAxisWidth + this.rightAxisWidth);\n    /* Y坐标轴的高度 */\n    this.yAxisHeight = this.shapeHeight;\n  }\n\n  createBottomXAxis () {\n    let xAxis = this.config.xAxis;\n    if (!xAxis || !xAxis.length) return;\n    let xAxisObj = xAxis[0];\n    this.scaleX = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_0__[\"scaleBand\"])(this.xAxisList, this.shapeWidth, true);\n    // 中间容器， x的刻度， 画布宽度， 画布高度， x轴的配置信息， 顶部X轴的高度, 标签的高度， x轴的值\n    Object(_shape_axis__WEBPACK_IMPORTED_MODULE_1__[\"initXAxis\"])(this.middle, this.scaleX, this.shapeWidth, this.shapeHeight, xAxisObj, this.topAxisHeight, this.labelHeight, this.xAxisList);\n  };\n\n  createXPart () {\n    let partList = this.config.xAxisPart;\n    if (!partList || !partList.length) return;\n    let len = partList.length;\n    let topAxisIndex = 0;\n    let perKey = null;\n    let perList = [];\n    for (let i = 0; i < len; i++) {\n      let xAxisList = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getKeyDataList\"])(this.data[0], partList[i].key);\n      let topAxis = topAxisIndex * 30 + 52;\n      let title = partList[i].title.value;\n      let key = partList[i].key;\n      let height = this.shapeHeight + 30 * (i + len - 1);\n      Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initXGrid\"])(this.middle, this.shapeWidth, height, topAxis, this.scaleX.bandwidth(), xAxisList, this.data[0], title, perKey, perList, key);\n      perKey = partList[0].key;\n      perList = xAxisList;\n      topAxisIndex++;\n    }\n  }\n\n  createYAxis (list, yAxisChild) {\n    for (let i = 0, len = list.length; i < len; i++) {\n      for (let j = 0; j < yAxisChild.length; j++) {\n        let position = yAxisChild[j].position;\n        let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue; // getMaxValue(this.data, yAxis[j].key);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_0__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        if (position === 'left') {\n          this.leftScaleY = scaleY;\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYGrid\"])(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, i);\n        } else {\n          this.rightScaleY = scaleY;\n        }\n        Object(_shape_axis__WEBPACK_IMPORTED_MODULE_1__[\"initYAxis\"])(this[`${position}Axis`], scaleY, yAxisChild[j], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], i, i === len - 1);\n      }\n    };\n  }\n\n  createYPart (yAxisChild, index) {\n    let yAxisPart = this.config.yAxisPart;\n    if (!yAxisPart || !yAxisPart.length) {\n      this.createYAxis([''], yAxisChild);\n      this.drawCanvas(null, index, yAxisChild);\n    } else {\n      let data = this.data[index];\n      for (let i = 0, len = yAxisPart.length; i < len; i++) {\n        let yAxisPartList = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getKeyDataList\"])(data, yAxisPart[i].key);\n        let uniquePartList = [...new Set(yAxisPartList)];\n        if (i === 0) {\n          this.yAxisHeight = this.shapeHeight / uniquePartList.length;\n          this.uniquePartList = uniquePartList;\n          this.createYAxis(uniquePartList, yAxisChild);\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initMiddleGrid\"])(this.middle, this.yAxisHeight, uniquePartList, this.shapeWidth, this.topAxisHeight);\n          this.drawCanvas(uniquePartList, index, yAxisChild);\n        } else {\n          Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYAxisLine\"])(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);\n        }\n        Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYAxisGrid\"])(this.leftAxis, this.yAxisHeight, uniquePartList, this.leftAxisWidth, (len - i - 1), this.topAxisHeight, yAxisPart[0].key, yAxisPart[i].key, data, i, yAxisPartList);\n      }\n    };\n  };\n\n  createCombinedYPart (yAxis) {\n    let yAxisPart = this.config.yAxisPart;\n    if (!yAxisPart || !yAxisPart.length) {\n      this.createCombinedYAxis(yAxis);\n    } else {\n      let len = yAxis.length;\n      for (let i = 0; i < len; i++) {\n        this.drawCombinedYPart(yAxisPart, yAxis[i], i, len);\n      }\n    }\n  };\n\n  drawCombinedYPart (yAxisPart, yAxisChild, index, len) {\n    let partLen = yAxisPart.length;\n    let data = this.data[index];\n    for (let i = 0; i < partLen; i++) {\n      let yAxisPartList = Object(_utils_data__WEBPACK_IMPORTED_MODULE_3__[\"getKeyDataList\"])(data, yAxisPart[i].key);\n      let uniquePartList = [...new Set(yAxisPartList)];\n      if (i === 0) {\n        this.yAxisHeight = this.shapeHeight / (uniquePartList.length * len);\n        this.uniquePartList = uniquePartList;\n        this.createCombinedYAxisYPart(uniquePartList, yAxisChild, index, len);\n      } else {\n        Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYAxisLine\"])(this.leftAxis, this.topAxisHeight, this.shapeHeight, i);\n      }\n      Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYAxisGrid\"])(this.leftAxis, this.yAxisHeight * len, uniquePartList, this.leftAxisWidth, (partLen - i - 1), this.topAxisHeight, yAxisPart[0].key, yAxisPart[i].key, data, i, yAxisPartList);\n    }\n  }\n\n  createCombinedYAxisYPart (uniquePartList, yAxisChild, index, len) {\n    for (let i = 0; i < uniquePartList.length; i++) {\n      let sum = (i * len) + index;\n      this.drawCombinedYAxis(yAxisChild, sum);\n      this.drawCombinedCanvas(null, sum, yAxisChild, index);\n      if (sum !== 0) {\n        this.drawCombinedXGrid(this.middle, this.topAxisHeight, sum, this.shapeWidth, this.yAxisHeight);\n      }\n    }\n  }\n\n  createCombinedYAxis (yAxis) {\n    let len = yAxis.length;\n    this.yAxisHeight = this.shapeHeight / len;\n    for (let i = 0; i < len; i++) {\n      this.drawCombinedYAxis(yAxis[i], i);\n      this.drawCombinedCanvas(null, i, yAxis[i], i);\n      if (i !== 0) {\n        this.drawCombinedXGrid(this.middle, this.topAxisHeight, i, this.shapeWidth, this.yAxisHeight);\n      }\n    }\n  };\n\n  drawCombinedYAxis (yAxisChild, index) {\n    for (let i = 0; i < yAxisChild.length; i++) {\n      let position = yAxisChild[i].position;\n      let yAxisMax = position === 'left' ? this.leftMaxValue : this.rightMaxValue; // getMaxValue(this.data, yAxis[j].key);\n      let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_0__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n      if (position === 'left') {\n        this.leftScaleY = scaleY;\n        Object(_shape_grid__WEBPACK_IMPORTED_MODULE_2__[\"initYGrid\"])(this.middle, this.shapeWidth, this.yAxisHeight, scaleY, this.topAxisHeight, index);\n      } else {\n        this.rightScaleY = scaleY;\n      }\n      Object(_shape_axis__WEBPACK_IMPORTED_MODULE_1__[\"initYAxis\"])(this[`${position}Axis`], scaleY, yAxisChild[i], this.tipTpl, this.yAxisHeight, this.topAxisHeight, this[`${position}AxisWidth`], index);\n    }\n  }\n\n  drawCombinedXGrid (middle, topAxisHeight, index, width, height) {\n    let grid = middle.append('g').attr('class', 'line');\n    let y = topAxisHeight + height * index;\n    grid.append('line')\n      .attr('x1', 0)\n      .attr('y1', y)\n      .attr('x2', width)\n      .attr('y2', y)\n      .attr('stroke-width', 1)\n      .attr('stroke', '#c2c9d1');\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/base.js?");

/***/ }),

/***/ "./src/chart/line.js":
/*!***************************!*\
  !*** ./src/chart/line.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Line; });\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ \"./src/chart/base.js\");\n/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/data */ \"./src/utils/data.js\");\n/* harmony import */ var _shape_scale_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shape/scale.js */ \"./src/shape/scale.js\");\n\n\n\nclass Line extends _base__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.data = data;\n    this.config = config;\n    this.colorList = config.colorList;\n    this.init();\n    this.drawLine();\n  };\n\n  drawLine () {\n    // d3提供的symbols，如果用户没有提供默认为圆点\n    let symbol = d3.symbolCircle;\n    // let rotated = 0;\n    // const symbols = {\n    //   cross: d3.symbolCross,\n    //   cross45: d3.symbolCross,\n    //   triangle: d3.symbolTriangle,\n    //   triangle180: d3.symbolTriangle,\n    //   square: d3.symbolSquare,\n    //   star: d3.symbolStar,\n    //   diamond: d3.symbolDiamond,\n    //   wye: d3.symbolWye\n    // };\n    // const rotateds = {\n    //   cross45: 45,\n    //   triangle180: 180\n    // };\n    let arc = d3.symbol().type(symbol).size(2 * 25);\n    if (!this.config.yAxis) return;\n    let yAxis = this.config.yAxis;\n    let len = yAxis.length;\n    for (let i = 0; i < len; i++) {\n      let key = yAxis[i].key;\n      let yAxisMax = Object(_utils_data__WEBPACK_IMPORTED_MODULE_1__[\"getMaxValue\"])(this.data, yAxis[i].key);\n      for (let j = 0; j < key.length; j++) {\n        let data = Object(_utils_data__WEBPACK_IMPORTED_MODULE_1__[\"getKeyDataList\"])(this.data, yAxis[i].key[j]);\n        let scaleY = Object(_shape_scale_js__WEBPACK_IMPORTED_MODULE_2__[\"scaleLinear\"])(yAxisMax, this.yAxisHeight);\n        let brandWidth = this.scaleX.bandwidth();\n        let valueLine = d3.line()\n          .defined((d) => (d))\n          .x((d, index) => {\n            return brandWidth * index + brandWidth / 2;\n          })\n          .y((d) => {\n            return scaleY(d);\n          });\n        let lineContainer = this.middle.append('g')\n          .attr('transform', `translate(0,${this.topAxisHeight})`);\n        lineContainer.append('path')\n          .attr('d', valueLine(data))\n          .attr('fill', 'none')\n          .attr('stroke-width', 2)\n          .attr('stroke', '#4284f5')\n          .attr('opacity', 1);\n\n        let pointer = lineContainer.selectAll('.point-group')\n          .data(data)\n          .enter()\n          .append('g');\n\n        pointer.append('path')\n          .attr('d', arc)\n          .attr('transform', (d, index) => {\n            let x = brandWidth * index + brandWidth / 2;\n            let y = scaleY(d);\n            return `translate(${x}, ${y})`;\n          })\n          .attr('fill', '#4284f5');\n      };\n    };\n  }\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/line.js?");

/***/ }),

/***/ "./src/chart/map.js":
/*!**************************!*\
  !*** ./src/chart/map.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return map; });\n/* harmony import */ var _utils_check_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/check.js */ \"./src/utils/check.js\");\n\nclass map {\n  constructor (data, config) {\n    this.config = config;\n    this.data = data;\n    this.scene = null;\n    this.clickLabelLayer = null;\n    this.markerLayer = null;\n    this.zoomLayer = null;\n    this.pointLayer = null;\n  };\n\n  render () {\n    // let idx = n.x;\n    // let idy = n.y;\n    // $$.bigContainer.append('div')\n    //   .attr('id', `${bindto.slice(1)}-${idx}-${idy}`)\n    //   .attr('style', `width: ${map_width}px; height: ${map_height}px; display: block; position: absolute;\n    //     transform: translate(${idx * width}px,  ${idy * height}px)`)\n\n    // scene = new L7.Scene({\n    //   id: `${bindto.slice(1)}-${idx}-${idy}`,\n    //   map: new L7.GaodeMap({\n    //     pitch: 0,\n    //     style: 'light',\n    //     center: [ 106.47111650000001, 34.00407302986006 ],\n    //     // center: [ 34.00407302986006, 106.47111650000001 ],\n    //     // center: [ 121.435159, 31.256971 ],\n    //     zoom: 3,\n    //     minZoom: 3\n    //   })\n    // });\n    var mapDiv = document.querySelector('#' + this.config.id);\n    mapDiv.innerHTML = '';\n    if (this.scene) {\n      this.scene.destroy();\n    }\n    this.resetData();\n    this.scene = new L7.Scene({\n      id: this.config.id,\n      map: new L7.GaodeMap({\n        pitch: 0,\n        style: 'light',\n        center: [106.47111650000001, 34.00407302986006],\n        // center: [ 34.00407302986006, 106.47111650000001 ],\n        // center: [ 121.435159, 31.256971 ],\n        zoom: 3,\n        minZoom: 3\n      })\n    });\n    this.scene.on('loaded', (ev) => {\n      this.fitBoundsMap();\n      this.addMapSymbols();\n      if (this.isMobile()) {\n        this.addZoomCtrl();\n      }\n      setTimeout(() => {\n        this.addMapLabels();\n      }, 100);\n      this.scene.on('zoomend', () => {\n        if (this.markerLayer) {\n          this.markerLayer.markers.forEach(item => {\n            item.remove();\n          });\n          this.markerLayer && this.scene.removeMarkerLayer(this.markerLayer);\n        }\n        this.addMapLabels();\n      }); // 缩放停止时触发\n    });\n  }\n\n  fitBoundsMap () {\n    // setTimeout(() => {\n    let xAggressions = this.config.column.aggressions;\n    let yAggressions = this.config.row.aggressions;\n    let latlngs = this.data.map(v => [v[xAggressions[0]], v[yAggressions[0]]]).filter(v => !Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(v[0]) && !Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(v[1]));\n    if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"notEmpty\"])(latlngs)) {\n      let latitudeArr = latlngs.map(item => {\n        return item[0];\n      });\n      let longitudeArr = latlngs.map(item => {\n        return item[1];\n      });\n      this.scene.fitBounds([\n        [Math.min(...longitudeArr), Math.min(...latitudeArr)],\n        [Math.max(...longitudeArr), Math.max(...latitudeArr)]\n      ]);\n    }\n    // }, 300);\n  };\n\n  addMapSymbols () {\n    let tooltip = this.config.tooltipList.map(item => {\n      return item.key;\n    });\n    // let mapZoom = scene.getZoom();\n    this.pointLayer = new L7.PointLayer({\n      name: 'symbol'\n    })\n      .source(this.data, {\n        parser: {\n          // 需要指定数据格式，不然默认的是geojson格式\n          type: 'json',\n          x: 'longitude',\n          y: 'latitude'\n        }\n      })\n      .shape('circle')\n      // .size(sized_feature, [1, 20])\n      .size(this.config.sizeFeature.feature, value => {\n        return this.getSize(value);\n      })\n      .style({\n        opacity: this.config.color && this.config.color.opacity,\n        strokeWidth: 0\n      });\n    if (this.config.colorFeature && this.config.colorFeature.feature) {\n      this.pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);\n    } else {\n      this.pointLayer.color('#4284F5');\n    }\n    this.scene.addLayer(this.pointLayer);\n    this.pointLayer.on('click', (ev) => {\n      if (this.scene.getLayerByName('clickLabelLayer')) {\n        this.scene.removeLayer(this.clickLabelLayer);\n      }\n      this.pointLayer.setSelect(ev.featureId);\n      this.pointLayer.style({\n        opacity: 0.2\n      });\n      this.addClickLabel(ev, this.scene);\n    });\n    this.pointLayer.on('unclick', (ev) => {\n      if (this.scene.getLayerByName('clickLabelLayer')) {\n        this.scene.removeLayer(this.clickLabelLayer);\n      }\n      this.pointLayer.color(this.config.colorFeature.feature, ['#7AC9F5', '#2A5783']);\n      this.pointLayer.style({\n        opacity: 1\n      });\n      this.pointLayer.setSelect(1000000);\n    });\n    let popupLayer = new L7.Popup({\n      closeButton: false\n    });\n    this.pointLayer.on('mousemove', (ev) => {\n      // if (!config.tooltip_show) return;\n      if (this.config.tooltipList.length === 0) return;\n      let tooltipData = ev.feature;\n      let obj = {};\n      for (const key in tooltipData) {\n        if (tooltip.indexOf(key) >= 0) {\n          obj[key] = tooltipData[key];\n        }\n      };\n      // var html = $$.formatTooltipText(obj);\n      let htmlContent = '';\n      for (const key in obj) {\n        htmlContent = htmlContent + `<div>${key}: ${obj[key]}</div>`;\n      };\n      let html = `<div>${htmlContent}</div>`;\n      popupLayer.setLnglat([ev.lngLat.lng, ev.lngLat.lat])\n        .setHTML(html);\n      this.scene.addPopup(popupLayer);\n    });\n    this.pointLayer.on('mouseout', (ev) => {\n      popupLayer.remove();\n    });\n  };\n\n  addMapLabels () {\n    if (this.markerLayer) {\n      this.markerLayer = null;\n    }\n    let labeleFeatures = this.config.labelFeature.map(item => {\n      return item.feature;\n    });\n    if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(labeleFeatures)) return;\n    this.markerLayer = new L7.MarkerLayer();\n    let getMapService = this.scene.getMapService();\n    let longPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[0]);\n    let latPixelsPerDegree = getMapService.coordinateSystemService.pixelsPerDegree && Math.abs(getMapService.coordinateSystemService.pixelsPerDegree[1]);\n    let symbolLayer = this.scene.getLayerByName('symbol');\n    let symbolCircle = symbolLayer.encodedData;\n    // 优化一下文本标签的显示，在文本标签太多导致重叠等等情况下\n    // 计算两个地方的半径和文本标签的长度之和，在这个范围内有其他标签的话都不显示\n    let noLabel = [];\n    let data = this.data;\n    for (let i = 0; i < data.length; i++) {\n      let v = data[i];\n      let circle = symbolCircle[i];\n      // let nextCircle = symbolCircle[i + 1];\n      let maxTxt = 0;\n      labeleFeatures.forEach((l, j) => {\n        // let txt = format_list[j].formatLabel(v[l])\n        let txt = v[l] + '';\n        maxTxt = txt.length > maxTxt ? txt.length : maxTxt;\n      });\n      let maxTxtLength = maxTxt * 8;\n      if (noLabel.indexOf(i) < 0) {\n        for (let j = i + 1; j < data.length; j++) {\n          let nextCircle = symbolCircle[j];\n          let longLength = longPixelsPerDegree * Math.abs(circle.coordinates[0] - nextCircle.coordinates[0]);\n          let latLength = latPixelsPerDegree * Math.abs(circle.coordinates[1] - nextCircle.coordinates[1]);\n          let circleLength = Math.sqrt(Math.pow(longLength, 2) + Math.pow(latLength, 2));\n          if ((maxTxtLength / 2 + circle.size / 2 + nextCircle.size / 2) > circleLength) {\n            if (noLabel.indexOf(j) < 0) {\n              noLabel.push(j);\n            }\n          }\n        }\n      }\n    }\n    for (let i = 0; i < data.length; i++) {\n      if (noLabel.indexOf(i) < 0) {\n        const divDom = document.createElement('div');\n        divDom.className = 'map-label-text';\n        divDom.style = 'display: flex; flex-direction: column; font-size: 12px; align-items: center;';\n        labeleFeatures.forEach((lf, lid) => {\n          const pDom = document.createElement('span');\n          // pDom.textContent = format_list[lid].formatLabel(data[i][lf]);\n          pDom.textContent = data[i][lf];\n          divDom.appendChild(pDom);\n        });\n        const el = document.createElement('label');\n        el.className = 'labelclass';\n        el.innerHTML = divDom.outerHTML;\n        const marker = new L7.Marker({\n          element: el\n        }).setLnglat({ lng: data[i].longitude, lat: data[i].latitude - 1 });\n        this.markerLayer.addMarker(marker);\n      }\n    }\n    this.scene.addMarkerLayer(this.markerLayer);\n  };\n\n  addZoomCtrl () {\n    this.zoomLayer = new L7.Zoom({\n      position: 'topright'\n    });\n    this.scene.addControl(this.zoomLayer);\n  };\n\n  resetData () {\n    this.scene = null;\n    this.clickLabelLayer = null;\n    this.markerLayer = null;\n    this.zoomLayer = null;\n    this.pointLayer = null;\n  };\n\n  getSize (n) {\n    const minRadius = this.config.point.size;\n    const maxRadius = minRadius * 8;\n    const midRadius = maxRadius / 3;\n    let data = this.data;\n    let sizeRange = [];\n    let sizeFeature = this.config.sizeFeature.feature;\n    let domain = [];\n    let range = [];\n    if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeFeature)) {\n      // domain = d3.extent(data.map(v => v[sizeFeature]))\n      let featureSizeArr = data.map(v => v[sizeFeature]);\n      domain[0] = Math.min(...featureSizeArr);\n      domain[1] = Math.max(...featureSizeArr);\n      if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeRange[0]) && sizeRange[0] !== null) domain[0] = Number(sizeRange[0]);\n      if (!Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isUndefined\"])(sizeRange[1]) && sizeRange[1] !== null) domain[1] = Number(sizeRange[1]);\n      if (domain[0] > domain[1]) domain[0] = domain[1];\n      range = [minRadius, maxRadius];\n      if (domain[0] === domain[1]) range = [midRadius, midRadius];\n    } else {\n      range = [midRadius, midRadius];\n    }\n    // $$.userDefined_sizeRange = domain\n    // let scale = d3.scaleLinear().range(range).domain(domain).clamp(true)\n    let curSize = range[0] + ((n - domain[0]) * (range[1] - range[0]) / (domain[1] - domain[0]));\n\n    return curSize;\n    // return function(d) {\n    //   return isDefined(d) ? Math.max(scale(d), 0) : mid_radius;\n    // }\n  };\n\n  isMobile () {\n    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {\n      return true;\n    } else {\n      return false;\n    }\n  }\n\n  // 增加一个图层，用来显示点击某个数据时高亮，而其他数据不显示\n  addClickLabel (ev, scene) {\n    this.clickLabelLayer = new L7.PointLayer({\n      name: 'clickLabelLayer'\n    })\n      .source(this.data, {\n        parser: {\n          type: 'json',\n          x: 'longitude',\n          y: 'latitude'\n        }\n      })\n      .shape('circle')\n      .size(this.config.sizeFeature.feature, [1, 20])\n      .color(this.config.colorFeature.feature, value => {\n        if (value === ev.feature[this.config.colorFeature.feature]) {\n          return '#2A5783';\n        }\n      })\n      .style({\n        opacity: 1,\n        strokeWidth: 0\n      });\n    this.scene.addLayer(this.clickLabelLayer);\n  };\n\n/**\n  getColorList() {\n    $$.modifyColorList({\n      colored_type: colored_type,\n      colored_feature: colored_feature,\n      keys: keys\n    })\n  }\n\n  getSizeList() {\n    if(isDefined(sized_feature)) {\n      let range = d3.extent(data.sort((a, b) => a[sized_feature] - b[sized_feature]).map(d => d[sized_feature]))\n      $$.modifySizeList({\n        sizeRange: range,\n        sized_feature: sized_feature\n      })\n    }\n  }\n  */\n};\n\n\n//# sourceURL=webpack://chart/./src/chart/map.js?");

/***/ }),

/***/ "./src/chart/table.js":
/*!****************************!*\
  !*** ./src/chart/table.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Table; });\n/* harmony import */ var _utils_check_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/check.js */ \"./src/utils/check.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* eslint-disable */\n// import Chart from '../Chart.js';\n\n// import CLASS from '../Classes.js';\n\n\nclass Table {\n  constructor (data, config) {\n    this.data = data;\n    this.config =config;\n  };\n  render () {\n    let tableHandle = init(this.data, this.config);\n    tableHandle.drawTable();\n  }\n}\n\nconst init = function (tableData, tableConfig) {\n  const $$ = this;\n  const config = tableConfig;\n  let colored_feature = config.data.colored.feature,\n    colored_type = config.data.colored.type,\n    data = [],\n    keys = [];\n\n  let table_padding = config.table.padding;\n  let table_body = config.table.body;\n  let table_padding_left = table_padding.left,\n      table_padding_right = table_padding.right,\n      table_padding_top = table_padding.top,\n      table_padding_bottom = table_padding.bottom,\n      table_body_width = table_body.width,\n      table_body_height = table_body.height,\n      cellBorderWidth = config.table.inner.width,\n      headBorderWidth = config.table.outter.width,\n      outerBorderColor = config.table.outter.color,\n      innerBorderColor = config.table.inner.color,\n      tableTitle = config.table.title;\n\n  // let {\n  //   table_padding_left,\n  //   table_padding_right,\n  //   table_padding_top,\n  //   table_padding_bottom,\n  //   table_body_width,\n  //   table_body_height,\n  //   table_title: tableTitle,\n  // } = config;\n  let paddingLeft = Number(table_padding_left),\n    paddingRight = Number(table_padding_right),\n    paddingTop = Number(table_padding_top),\n    paddingBottom = Number(table_padding_bottom);\n  let width = Number(table_body_width) + paddingLeft + paddingRight;\n\n  let height = Number(table_body_height) + paddingTop + paddingBottom;\n  if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isMobile\"])()) {\n    height = height * config.dpr;\n    width = width * config.dpr;\n  }\n  // $$.color = $$.generateColor();\n\n  let mode = config.table.mode;\n\n  let maxHeight = d3.max(tableTitle, function (d) {\n    return Math.max(Number(d.style['line-height']));\n  });\n\n  let titleKey = config.data.column.categories.join(' / ');\n  let titleMatch = tableTitle.find((i) => i.key === titleKey);\n  let titleStyle = {\n\t\talign: 'left',\n    fontSize: 12,\n    fontColor: '',\n    fontStyle: 'normal',\n    decoration: '',\n    letterSpacing: '',\n    lineHeight: '16.5',\n    display: 'auto'\n\t};\n  let titleShow = config.data.column.categories.length > 0;\n  if (titleMatch) {\n    titleStyle = titleMatch.style;\n    titleShow = titleMatch.show;\n    titleStyle.color = titleStyle.fill;\n  } else {\n    titleStyle.color = config.font.color;\n  }\n  if (titleMatch) {\n    titleStyle.lineHeight = Number(titleStyle['line-height']) + 16;\n  } else {\n    titleStyle.lineHeight = Number(titleStyle.lineHeight) + 16;\n  }\n  let aggShow = false;\n\n  let drawTable = function () {\n    //获取标签样式\n    // $$.getLabelStyleList();\n\n    var minRowHeight = 30;\n    var currentRowHeight = height;\n    // let formatList = $$.label_format_list;\n    let formatList = [];\n    let tooltipText = config.tooltip.text;\n    let tooltipFormat = config.tooltip.format;\n    let rowAggression = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.row.aggressions)\n      ? Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.labeled)\n        ? []\n        : config.data.labeled\n      : config.data.row.aggressions;\n    let columnAggression = config.data.column.aggressions;\n\n    let aggMatchLen = 0;\n    let singleHeadFlag = false;\n    // let aggHeadHideLen = columnAggression.filter(i => {\n    //   let match = tableTitle.find(m => m.key === i);\n    //   return match && !match.show\n    // }).length\n    // let hideHeadFlag = aggHeadHideLen === columnAggression.length\n    isAggShow();\n    if (!aggShow) {\n      aggShow = aggMatchLen < rowAggression.length; // 说明会显示\n    }\n    let titleFlag =\n      Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.row.categories) &&\n      Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.column.categories) &&\n      Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.column.aggressions);\n\n    //将列和数据赋给gridOptions\n    let colorFeature = config.data.colored.feature;\n    let start = new Date().getTime();\n    let columns = initColumns();\n    let gridData = initData();\n    // console.log('数据处理时间:', new Date().getTime() - start);\n    // console.log(gridData);\n    // console.log(columns);\n    // let startRender = new Date().getTime();\n    var gridOptions = initConfig();\n\n    // var minRowHeight = 30;\n    // var currentRowHeight;\n    var eGridDiv = document.querySelector(config.bindto);\n    eGridDiv.innerHTML = '';\n    if (!eGridDiv) {\n      return;\n    }\n    let dom = document.querySelectorAll(`.dc-chart`); //  //\n    if (dom.length > 1) {\n      dom = document.getElementById(config.bindto.slice(1));\n    } else {\n      dom = dom[0];\n    }\n    let { background: bgColor, index } = config.table.background;\n\n    let { cHeight, cWidth } = setWidthHeight();\n    eGridDiv.style.border = headBorderWidth + 'px solid ' + outerBorderColor;\n    eGridDiv.style.height = cHeight - headBorderWidth * 2 + 'px'; // cHeight - headBorderWidth * 2 + 'px';\n    eGridDiv.style.width = cWidth;\n    if (bgColor && bgColor.indexOf('/') > -1) {\n      eGridDiv.style.background = 'inherit';\n    } else {\n      eGridDiv.style.background = bgColor;\n      eGridDiv.style.opacity = config.table.background.opacity || 1;\n    }\n\n    eGridDiv.classList.add('ag-theme-balham');\n\n    // document.addEventListener('DOMContentLoaded', function() {\n    //   var eGridDiv = document.querySelector(config.bindto);\n    //   eGridDiv.style.height='700px'\n    //   new agGrid.Grid(eGridDiv, gridOptions);\n    // });\n    let startRender = new Date().getTime();\n    new agGrid.Grid(eGridDiv, gridOptions);\n\n    function isAggShow () {\n      rowAggression.forEach((i) => {\n        let match = tableTitle.find((m) => m.key === i);\n        if (match) {\n          aggMatchLen++;\n        }\n        if (match && match.show) {\n          aggShow = match.show;\n        }\n      });\n    }\n\n    function setWidthHeight () {\n      if (!dom) {\n        return {\n          cWidth: config.size.width,\n          cHeight: config.size.height,\n        };\n      }\n      let cHeight = dom.clientHeight; // - 10;\n      let cWidth = '100%';\n      if (config.size_width) {\n        cWidth = config.size.width + 'px'; //- 10\n      }\n      if (config.size.height) {\n        cHeight = config.size.height; // - 10;\n      }\n      return {\n        cWidth,\n        cHeight\n      };\n    }\n\n    function onFirstDataRendered (params) {\n      if (this.onGridSizeChanged) {\n        this.onGridSizeChanged(params);\n      } else if (onGridSizeChanged) {\n        onGridSizeChanged(params);\n      }\n    }\n\n    function onGridSizeChanged (params) {\n      // get the height of the grid body - this excludes the height of the headers\n      if (!document.getElementsByClassName('ag-body-viewport')[0]) {\n        return;\n      }\n\n      var gridHeight = document.getElementsByClassName('ag-body-viewport')[0]\n        .offsetHeight;\n\n      // get the rendered rows\n      var renderedRows = params.api.getRenderedNodes();\n\n      // if the rendered rows * min height is greater than available height, just just set the height\n      // to the min and let the scrollbar do its thing\n      if (renderedRows.length * minRowHeight >= gridHeight) {\n        if (currentRowHeight !== minRowHeight) {\n          currentRowHeight = minRowHeight;\n          params.api.resetRowHeights();\n        }\n      } else {\n        // set the height of the row to the grid height / number of rows available\n        currentRowHeight = Math.floor(gridHeight / renderedRows.length);\n        params.api.resetRowHeights();\n      }\n    }\n\n    function getCurrentHeight (params) {\n      var gridHeight = document.getElementsByClassName('ag-body-viewport')[0]\n        .offsetHeight;\n      var renderedRows = gridData.length;\n      if (renderedRows * minRowHeight >= gridHeight) {\n        if (currentRowHeight !== minRowHeight) {\n          currentRowHeight = minRowHeight;\n          params.api.resetRowHeights();\n        }\n      } else {\n        // set the height of the row to the grid height / number of rows available\n        currentRowHeight = Math.floor(gridHeight / renderedRows);\n        params.api.resetRowHeights();\n      }\n    }\n\n    function modifyHeight () {\n      gridData.forEach((i) => {\n        i.columnStyle.height = currentRowHeight;\n        i.columnStyle.lineHeight = currentRowHeight + 'px';\n      });\n    }\n    /**\n     * 初始化config\n     */\n    function initConfig() {\n      if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isMobile\"])()) {\n        maxHeight = maxHeight * config.dpr;\n      }\n      return {\n        columnDefs: columns,\n        // rowData: gridData,\n        onGridReady: function (params) {\n          if (mode === 'fitHeight' || mode === 'full') {\n            getCurrentHeight(params);\n            // 获取currentHeight\n            modifyHeight();\n          }\n\n          let wrap = eGridDiv.querySelector(\n            '.ag-theme-balham .ag-root-wrapper'\n          );\n          if (bgColor && bgColor.indexOf('/') > -1) {\n            wrap.style.background = 'inherit';\n          } else {\n            wrap.style.background = bgColor;\n            wrap.style.opacity = config.table.background.opacity || 1;\n          }\n\n          let headDom = eGridDiv.querySelector('.ag-header');\n          headDom.style.borderColor = innerBorderColor;\n          headDom.style.borderWidth = cellBorderWidth + 'px';\n          headDom.style.borderBottomWidth = cellBorderWidth + 'px';\n          if (titleFlag) {\n            headDom.style.display = 'none !important';\n          }\n          let noGroup = eGridDiv.querySelectorAll(\n            '.ag-header-row .ag-header-group-cell-no-group'\n          );\n          noGroup.forEach((i) => {\n            i.style.borderRight =\n              cellBorderWidth + 'px solid ' + innerBorderColor;\n          });\n\n          let domHeight = cHeight || (dom && dom.clientHeight);\n          let domWidth = dom && dom.clientWidth;\n          let colLength = params.columnApi.getAllDisplayedColumns().length;\n          // + (cellBorderWidth * colLength)\n          let curWidth = colLength * width;\n          let headCount =\n            params.columnApi.columnController.primaryHeaderRowCount;\n          let rowCount = gridData.length;\n          // + (headCount + rowCount) * cellBorderWidth\n          if (currentRowHeight === Infinity) {\n            currentRowHeight = height;\n          }\n          let tempHeight =\n            mode === 'fitHeight' || mode === 'full' ? currentRowHeight : height;\n          let curHeight = singleHeadFlag\n            ? rowCount * tempHeight\n            : headCount * maxHeight + rowCount * tempHeight;\n          let hBorderLen = 1; // (headCount + rowCount - 1) * cellBorderWidth;\n          let lBorderLen = 1; // colLength * cellBorderWidth;\n          if (mode === 'standard' || mode === 'fitHeight') {\n            if (curWidth < domWidth) {\n              if (curHeight < domHeight) {\n                eGridDiv.style.width = curWidth + 'px';\n                eGridDiv.style.height =\n                  curHeight + headBorderWidth * 2 + hBorderLen + 'px';\n                eGridDiv.querySelector('.ag-body-horizontal-scroll') &&\n                  eGridDiv.querySelector('.ag-body-horizontal-scroll').remove();\n              } else {\n                eGridDiv.style.width =\n                  curWidth + 10 + headBorderWidth * 2 + lBorderLen + 'px';\n              }\n            } else {\n              eGridDiv.style.width = '100%';\n              if (curHeight < domHeight) {\n                eGridDiv.style.height =\n                  curHeight + 10 + headBorderWidth * 2 + hBorderLen + 'px'; // 11\n              }\n            }\n          }\n          // if (mode === 'standard' || mode === 'fitHeight') {\n          //   if (curWidth < domWidth) {\n          //     eGridDiv.style.width = curWidth + 10 + 'px'\n          //   } else {\n          //     eGridDiv.style.width = '100%'\n          //     //eGridDiv.style.height = config.size_height + 6 + 'px'\n          //   }\n          // }\n          // mode === 'standard' ||\n          if (mode === 'fitWidth') {\n            if (curHeight < domHeight) {\n              if (curWidth > domWidth) {\n                eGridDiv.style.height =\n                  curHeight + headBorderWidth * 2 + +lBorderLen + 'px'; // 10\n              } else {\n                eGridDiv.style.height =\n                  curHeight + headBorderWidth * 2 + hBorderLen + 'px'; // 1\n              }\n            }\n          }\n          if (mode === 'full' || mode === 'fitWidth') {\n            if (\n              curHeight >\n              domHeight - rowCount * cellBorderWidth - headBorderWidth * 2\n            ) {\n              eGridDiv.style.width = 'calc(100% - 10px)';\n              // eGridDiv.style.width =\n              //   config.size_width + headBorderWidth * 2 + lBorderLen + 'px';\n            } else {\n              eGridDiv.style.width = '100%';\n              // eGridDiv.style.width =\n              //   config.size_width + headBorderWidth * 2 + lBorderLen - 10 + 'px';\n              if (mode === 'full') {\n                eGridDiv.style.height =\n                  curHeight +\n                  (rowCount * cellBorderWidth) / 2 -\n                  cellBorderWidth +\n                  headBorderWidth * 2 +\n                  'px';\n              }\n\n              eGridDiv.querySelector('.ag-body-horizontal-scroll') &&\n                eGridDiv.querySelector('.ag-body-horizontal-scroll').remove();\n            }\n          }\n          if (mode === 'full' || mode === 'fitWidth') {\n            gridOptions.api.sizeColumnsToFit(); // 调整表格大小自适应\n            if (\n              curHeight >\n              domHeight - rowCount * cellBorderWidth - headBorderWidth * 2\n            ) {\n              eGridDiv.style.width = '100%';\n            }\n          }\n          if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isMobile\"])()) {\n            let colsClass = eGridDiv.querySelector('.ag-center-cols-viewport').getAttribute('class') + ' ' + 'ag-center-mobile-cols-viewport';\n            eGridDiv.querySelector('.ag-center-cols-viewport').setAttribute('class', colsClass);\n            // eGridDiv.querySelector('.ag-center-cols-viewport').style.overflow = 'auto !important';\n          }\n\n          gridOptions.api.setRowData(gridData);\n          // console.log('数据加载时间:', new Date().getTime() - startRender);\n        },\n        onFirstDataRendered: onFirstDataRendered,\n        onGridSizeChanged: onGridSizeChanged,\n        defaultColDef: {\n          editable: false, // 单元表格是否可编辑\n          enableRowGroup: true,\n          enablePivot: true,\n          enableValue: true,\n          color: config['font-color'],\n          width: width,\n          height: 30,\n          'padding-left': table_padding_left,\n          'padding-right': table_padding_right + 4,\n          'padding-top': table_padding_top,\n          'padding-bottom': table_padding_bottom,\n          suppressMovable: true\n        },\n        suppressCellSelection: true,\n        cellClass: 'no-border',\n        headerHeight: titleFlag ? 0 : maxHeight,\n        suppressRowTransform: true,\n        suppressDragLeaveHidesColumns: true,\n        tooltipShowDelay: 0,\n        components: {\n          showCellRenderer: createShowCellRenderer(),\n          customTooltip: createTooltip(),\n          agColumnHeader: createCustomHeader()\n        },\n        getRowStyle: function (params) {\n          let style = {\n            background: 'rgba(255, 255, 255, 0.3)'\n          };\n          if (params.node.rowIndex % 2 === 0) {\n            style.background = 'rgba(255, 255, 255, 0.1)';\n          }\n          return style;\n        },\n        getRowHeight: function (params) {\n          let tempHeight = height;\n          tempHeight =\n            (params.data.columnStyle &&\n              Number(params.data.columnStyle.height)) ||\n            30;\n          if (mode === 'full' || mode === 'fitHeight') {\n            return currentRowHeight || tempHeight;\n          }\n          return tempHeight;\n        },\n        onBodyScroll: function (params) {\n          let { direction } = params;\n          if (direction === 'horizontal') {\n            let noGroup = eGridDiv.querySelectorAll(\n              '.ag-header-row .ag-header-group-cell-no-group'\n            );\n            noGroup.forEach((i) => {\n              i.style.borderRight =\n                cellBorderWidth + 'px solid ' + innerBorderColor;\n            });\n            gridOptions.api.checkGridSize();\n            gridOptions.api.doLayout();\n          }\n        }\n      };\n    }\n\n    /**\n     * 初始化data\n     */\n    function initData () {\n      let resGridData = [];\n      let resGridData1 = [];\n      let rowCategory = config.data.row.categories;\n      // 先考虑categories不存在\n      if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(rowCategory)) {\n        // 行数据的第一列值就是rowAggression\n        let curAgg = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(rowAggression) ? columnAggression : rowAggression;\n        if (curAgg.length === 0) {\n          return resGridData;\n        }\n        let obj1 = {};\n        for (let i = 0; i < curAgg.length; i++) {\n          let agg = curAgg[i];\n          let obj = {};\n          let matchAgg = tableTitle.find((m) => m.key === agg);\n          if (!matchAgg) {\n            obj.data_row_aggressions = agg;\n          } else if (matchAgg && matchAgg.show) {\n            obj.data_row_aggressions = matchAgg.title;\n          }\n\n          obj.columnStyle = returnColumnStyle(agg);\n          obj1.columnStyle = obj.columnStyle;\n          let match = formatList.find((i) => i.label_name === agg);\n          tableData.map((row) => {\n            if (row.hasOwnProperty(agg)) {\n              Object.assign(obj, returnValue(row, agg, match));\n              Object.assign(obj1, returnValue(row, agg, match));\n            }\n          });\n          resGridData.push(obj);\n        }\n        resGridData1.push(obj1);\n        if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(rowAggression)) {\n          return resGridData1;\n        }\n      } else {\n        resGridData = getGridData(rowCategory);\n      }\n\n      return resGridData;\n    }\n\n    function returnColProp (i) {\n      let prop = '';\n      config.data.column.categories.forEach((c) => {\n        prop += i[c] + '-';\n      });\n      if (prop) {\n        prop = prop.substr(0, prop.length - 1);\n      }\n      return prop;\n    }\n\n    function returnColumnStyle (agg) {\n      let match = formatList.find((i) => i.label_name === agg);\n      let style = {\n        align: 'right',\n        fontSize: 12,\n        fontColor: '#6b6b6b',\n        fontStyle: 'normal',\n        decoration: '',\n        letterSpacing: '',\n        lineHeight: '24'\n      };\n      if (match) {\n        style = match.initLabelText.format;\n      }\n      let columnStyle = {\n        textDecoration: style.decoration,\n        color: style.setFlag ? style.fontColor : config.font_color,\n        fontSize: style.fontSize + 'px',\n        fontStyle: style.fontStyle,\n        letterSpacing: style.letterSpacing + 'px',\n        paddingLeft: paddingLeft + 'px',\n        paddingBottom: paddingBottom + 'px',\n        paddingTop: paddingTop + 'px',\n        paddingRight: paddingRight + 4 + 'px',\n        // lineHeight: Number(style.lineHeight) + paddingBottom + paddingTop + 'px',\n        textAlign: style.align\n        // height: Number(style.lineHeight) + paddingBottom + paddingTop\n      };\n\n      if (mode === 'full' || mode === 'fitHeight') {\n        if (currentRowHeight) {\n          columnStyle.height = currentRowHeight;\n          columnStyle.lineHeight = currentRowHeight + 'px';\n        }\n      } else {\n        columnStyle.height =\n          Number(style.lineHeight) + paddingBottom + paddingTop;\n        if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isMobile\"])()) {\n          columnStyle.height = columnStyle.height * config.dpr;\n        }\n        if (paddingBottom === 0 && paddingTop === 0) {\n          columnStyle.lineHeight = columnStyle.height + 'px';\n        }\n      }\n      return columnStyle;\n    }\n\n    function returnValue (i, agg, match) {\n      let obj = {};\n      let colProp = returnColProp(i);\n      if (columnAggression.length > 0) {\n        colProp = colProp.length > 0 ? colProp + '-' + agg : agg;\n      }\n      let columnProp = colProp || 'singleHead';\n      columnProp = columnProp\n        .replace(/,/g, '')\n        .replace(/\\(/g, '')\n        .replace(/\\)/g, '')\n        .replace(/\\s+/g, '')\n        .replace(/\\./, '');\n      obj[columnProp] = {};\n      obj[columnProp].value =\n        i[agg] || i[agg] === 0\n          ? match\n            ? match.formatLabel(i[agg])\n            : i[agg]\n          : '';\n      if (colorFeature) {\n        obj[columnProp].labelValue = i[colorFeature];\n      } else {\n        obj[columnProp].labelValue = i[agg];\n      }\n\n      obj[columnProp].label = [];\n      obj[columnProp].columnStyle = returnColumnStyle(agg);\n\n      let tooltipObj = JSON.parse(JSON.stringify(tooltipText));\n      for (const key in i) {\n        if (key === 'MC-HIDDEN-KEY') {\n          continue;\n        }\n        if (i.hasOwnProperty(key)) {\n          let flag = !!tooltipObj[key];\n          let textFormat = {\n            align: 'left',\n            fontSize: 12,\n            fontColor: '',\n            fontStyle: 'normal',\n            decoration: '',\n            letterSpacing: '',\n            lineHeight: '16.5',\n            display: 'auto'\n          };\n          const ele = flag ? tooltipObj[key] : textFormat;\n          if (rowAggression.indexOf(key) > -1 && agg !== key) {\n            continue;\n          }\n          let labelObj = {};\n          labelObj.tooltipFormat = {};\n          labelObj.name = flag ? tooltipObj[key].title : key;\n          labelObj.value = i[key];\n          labelObj.style = ele;\n          labelObj.display = ele.display ? ele.display : 'auto';\n          let tableNumFormat = {\n            selectFormat: 'digit',\n            decimal: '',\n            negative: '-1',\n            unit: '',\n            prefix: '',\n            suffix: '',\n            zone: 'CN',\n            useThousandMark: true\n          };\n          let format = flag ? tooltipFormat[key] : tableNumFormat;\n          Object.assign(labelObj.tooltipFormat, format);\n          if (flag) {\n            // ele.display !== 'none' &&\n            if (rowAggression.indexOf(key) === -1) {\n              obj[columnProp].label.push(labelObj);\n            } else if (key === agg) {\n              // ele.display !== 'none' &&\n              obj[columnProp].label.push(labelObj);\n            }\n          } else {\n            obj[columnProp].label.push(labelObj);\n          }\n        }\n      }\n      return obj;\n    }\n\n    function getGridData (rowCategory) {\n      let resData = [];\n\n      let catData = getColumn(rowCategory);\n      let catArr = [];\n      let catReverse = JSON.parse(JSON.stringify(rowCategory)).reverse();\n      // 计算出span\n      let spanObj = {};\n      let tempData = [];\n      getSpanProcess(catData, spanObj);\n      let test = JSON.parse(JSON.stringify(spanObj));\n      // console.log(test);\n\n      function getSpanProcess (curData, obj) {\n        curData.map((curRow) => {\n          let key = curRow.parentKey\n            ? curRow.parentKey + '-' + curRow.key\n            : curRow.key;\n          key = key\n            .replace(/,/g, '')\n            .replace(/\\(/g, '')\n            .replace(/\\)/g, '')\n            .replace(/\\s+/g, '')\n            .replace(/\\./, '');\n          curRow.values.map((row, idx) => {\n            let arr = [];\n            if (curRow.values[0].key) {\n              getSpan(curRow.values, arr, obj);\n              obj[key] = {};\n              obj[key].total = arr.reduce((prev, curr) => {\n                return prev + curr;\n              });\n              obj[key].len = obj[key].total;\n            }\n            if (row.key) {\n              let parentKey = key;\n              row.parentKey = parentKey;\n              tempData.push(row);\n              if (idx === curRow.values.length - 1) {\n                let tempChildData = JSON.parse(JSON.stringify(tempData));\n                tempData = [];\n                getSpanProcess(tempChildData, obj);\n              }\n            } else if (curRow.values) {\n              obj[key] = {};\n              obj[key].total = curRow.values.length;\n              obj[key].len = curRow.values.length;\n            }\n          });\n        });\n      }\n      // 最终返回count\n      function getSpan (curData, arr, obj) {\n        curData.map((row) => {\n          if (row.values && row.values[0].key) {\n            getSpan(row.values, arr, obj);\n          } else {\n            // 最后的一个cat\n            if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(rowAggression)) {\n              arr.push(1);\n            } else {\n              arr.push(rowAggression.length ? rowAggression.length : 1);\n            }\n          }\n        });\n      }\n\n      function findSpanByCat (catArr, catName, idx, deduceFlag) {\n        idx = catArr.length - idx - 1;\n        let curCatArr = JSON.parse(JSON.stringify(catArr));\n        curCatArr.reverse();\n        // idx = curCatArr.indexOf(catName)\n        let str = curCatArr.slice(0, idx + 1).join('-');\n        if (deduceFlag) {\n          spanObj[str] ? (spanObj[str].len > 1 ? spanObj[str].len-- : 1) : 1;\n        }\n        return spanObj[str] ? spanObj[str] : 1;\n      }\n\n      function gridDataProcess (rowData) {\n        rowData.map((row, rowIdx) => {\n          // 如果存在，说明\n          if (row.values[0].key) {\n            // 跨行显示\n            catArr.unshift(row.key);\n            gridDataProcess(row.values);\n            catArr.shift();\n          } else {\n            catArr.unshift(row.key);\n            // 最后的一个cat\n            if (columnAggression.length > 0) {\n              // let len = 1\n              let deepCatArr = JSON.parse(JSON.stringify(catArr));\n              let obj = {};\n              catReverse.map((rowCat, idx) => {\n                obj[rowCat] = {};\n                obj[rowCat].value = deepCatArr[idx];\n                let { len, total } = findSpanByCat(\n                  deepCatArr,\n                  deepCatArr[idx],\n                  idx\n                );\n                if (idx === 0) {\n                  obj[rowCat].rowSpan = 1;\n                  obj[rowCat].rowLen = 1;\n                } else {\n                  obj[rowCat].rowLen = total;\n                  obj[rowCat].rowSpan = len > 0 ? len : 1;\n                  findSpanByCat(deepCatArr, deepCatArr[idx], idx, true);\n                }\n                if (rowIdx % total !== 0) {\n                  obj[rowCat].grpSpan = true;\n                }\n                // columnAggression.map((agg) => {\n                //   obj.columnStyle = returnColumnStyle(agg);\n                //   let match = formatList.find((i) => i.label_name === agg);\n                //   row.values.forEach((i) => {\n                //     let key = i['MC-HIDDEN-KEY'];\n                //     let propArr = key.split(CLASS.join_factor);\n                //     if (i.hasOwnProperty(agg)) {\n                //       Object.assign(obj, returnValue(i, agg, match));\n                //     }\n                //   });\n                // });\n              });\n              columnAggression.map((agg) => {\n                obj.columnStyle = returnColumnStyle(agg);\n                let match = formatList.find((i) => i.label_name === agg);\n                row.values.forEach((i) => {\n                  let key = i['MC-HIDDEN-KEY'];\n                  let propArr = key.split('MC-SEPERATE-WORD');\n                  if (i.hasOwnProperty(agg)) {\n                    Object.assign(obj, returnValue(i, agg, match));\n                  }\n                });\n              });\n              resData.push(obj);\n            } else if (rowAggression.length > 0) {\n              rowAggression.map((agg, aggIdx) => {\n                let obj = {};\n                let len = 1;\n                let deepCatArr = JSON.parse(JSON.stringify(catArr));\n                let matchAgg = tableTitle.find((m) => m.key === agg);\n                catReverse.map((rowCat, idx) => {\n                  obj[rowCat] = {};\n                  obj[rowCat].value = deepCatArr[idx];\n                  let lenObj = findSpanByCat(deepCatArr, deepCatArr[idx], idx);\n                  if (idx === 0) {\n                    len = rowAggression.length ? rowAggression.length : 1;\n                    if (aggIdx !== 0) {\n                      // len = len - ((rowIdx + 1) * rowAggression.length - 1)\n                      len = len - aggIdx;\n                    }\n                    obj[rowCat].rowLen = 1;\n                  } else {\n                    len = lenObj.len;\n                    obj[rowCat].rowLen = lenObj.total;\n                  }\n                  obj[rowCat].rowSpan = len > 0 ? len : 1;\n                  if (\n                    (rowIdx *\n                      (rowAggression.length ? rowAggression.length : 1)) %\n                      (lenObj.total || 1) ===\n                    0\n                  ) {\n                    if (aggIdx !== 0) {\n                      obj[rowCat].grpSpan = true;\n                    }\n                  } else {\n                    obj[rowCat].grpSpan = true;\n                  }\n                  if (idx !== 0) {\n                    len = findSpanByCat(deepCatArr, deepCatArr[idx], idx, true)\n                      .len;\n                  }\n                });\n                obj.columnStyle = returnColumnStyle(agg);\n                let match = formatList.find((i) => i.label_name === agg);\n                row.values.forEach((i) => {\n                  obj.data_row_aggressions = matchAgg ? matchAgg.title : agg;\n                  // let key = i['MC-HIDDEN-KEY'];\n                  // let propArr = key.split('MC-SEPERATE-WORD');\n                  // if (i.hasOwnProperty(agg)) {\n                  //   if (\n                  //     (propArr.length > 1 &&\n                  //       propArr[propArr.length - 1] === agg) ||\n                  //     isEmpty(config.data_row_aggressions)\n                  //   ) {\n                  //     Object.assign(obj, returnValue(i, agg, match));\n                  //   }\n                  // }\n                  Object.assign(obj, returnValue(i, agg, match));\n                });\n                resData.push(obj);\n              });\n            } else {\n              // let len = 1\n              let deepCatArr = JSON.parse(JSON.stringify(catArr));\n              let obj = {};\n              catReverse.map((rowCat, idx) => {\n                obj[rowCat] = {};\n                obj[rowCat].value = deepCatArr[idx];\n                let { len, total } = findSpanByCat(\n                  deepCatArr,\n                  deepCatArr[idx],\n                  idx\n                );\n                if (idx === 0) {\n                  obj[rowCat].rowSpan = 1;\n                  obj[rowCat].rowLen = 1;\n                } else {\n                  obj[rowCat].rowSpan = len > 0 ? len : 1;\n                  len = findSpanByCat(deepCatArr, deepCatArr[idx], idx, true);\n                  obj[rowCat].rowLen = total;\n                }\n\n                if (rowIdx % total !== 0) {\n                  obj[rowCat].grpSpan = true;\n                }\n\n                // obj.columnStyle = returnColumnStyle('');\n                // let match = null;\n                // row.values.forEach((i) => {\n                //   Object.assign(obj, returnValue(i, '', match));\n                // });\n              });\n              obj.columnStyle = returnColumnStyle('');\n              let match = null;\n              row.values.forEach((i) => {\n                Object.assign(obj, returnValue(i, '', match));\n              });\n              resData.push(obj);\n            }\n\n            catArr.shift();\n          }\n        });\n      }\n      gridDataProcess(catData);\n      return resData;\n    }\n    /// ////////////结束获取data/////////////////////\n\n    /**\n     * 开始初始化grid的column\n     */\n    function initColumns() {\n      let colCategory = config.data.column.categories;\n      let partColumn = getColumn(colCategory);\n      let temColumn = config.data.row.categories;\n      let resColumn = [];\n\n      temColumn.forEach((i) => {\n        let match = tableTitle.find((t) => t.key === i);\n        let style = {\n          align: 'left',\n          fontSize: 12,\n          fontColor: '',\n          fontStyle: 'normal',\n          decoration: '',\n          letterSpacing: '',\n          lineHeight: '16.5',\n          display: 'auto'\n        };\n        let show = true;\n        if (match) {\n          style = JSON.parse(JSON.stringify(match.style));\n          style.color = style.fill;\n          show = match.show;\n        } else {\n          style.color = config.font.color;\n        }\n        resColumn.push({\n          headerName: match ? match.title : i,\n          field: i,\n          cellRenderer: 'showCellRenderer',\n          headerTooltip: match ? match.title : i,\n          headerComponentParams: {\n            style: style,\n            show: show,\n            maxHeight,\n            cellBorderWidth,\n            borderTopShow: '1',\n            innerBorderColor: innerBorderColor\n          },\n          pinned: 'left',\n          lockPinned: true,\n          cellClass: 'lock-pinned',\n          tooltipComponent: 'customTooltip',\n          tooltipField: i,\n          tooltipComponentParams: {\n            style: {\n              align: 'left',\n              fontSize: 12,\n              fontColor: '',\n              fontStyle: 'normal',\n              decoration: '',\n              letterSpacing: '',\n              lineHeight: '16.5',\n              display: 'auto'\n            },\n            header: true,\n          },\n          cellStyle: (params) => {\n            if (params.value) {\n              let height = 0;\n              if (mode === 'full' || mode === 'fitHeight') {\n                if (currentRowHeight) {\n                  height = params.value.rowSpan * currentRowHeight + 'px';\n                }\n              } else {\n                height =\n                  params.value.rowSpan * params.data.columnStyle.height + 'px';\n              }\n              return retHeadCellStyle(height, params);\n            }\n          },\n          rowSpan: function (params) {\n            if (params.data[i]) {\n              return params.data[i].rowSpan;\n            }\n          },\n          cellClassRules: {\n            'cell-span': (params) => {\n              if (params.data[i]) {\n                return params.data[i].rowSpan ? true : false;\n              } else {\n                return false;\n              }\n            },\n            'cell-group': 'true',\n            'cont-span': (params) => {\n              if (params.data[i]) {\n                return params.data[i].grpSpan ? true : false;\n              } else {\n                return false;\n              }\n            },\n          },\n        });\n      });\n      let flag = !aggShow && !titleShow; //\n      if (!flag && config.data.row.aggressions.length > 0) {\n        let curStyle = {\n          align: 'left',\n          fontSize: 12,\n          fontColor: '',\n          fontStyle: 'normal',\n          decoration: '',\n          letterSpacing: '',\n          lineHeight: '16.5',\n          display: 'auto'\n        };\n        if (tableTitle.length > 0) {\n          curStyle = tableTitle[0].style;\n          curStyle.color = curStyle.fill;\n        }\n        resColumn.push({\n          headerName: titleShow ? '' : titleMatch ? titleMatch.title : titleKey,\n          field:\n            aggShow && !Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.row.aggressions)\n              ? 'data_row_aggressions'\n              : '',\n          headerTooltip: titleShow\n            ? ''\n            : titleMatch\n              ? titleMatch.title\n              : titleKey,\n          tooltipField: 'data_row_aggressions',\n          tooltipComponent: 'customTooltip',\n          pinned: 'left',\n          lockPinned: true,\n          cellClass: 'lock-pinned',\n          tooltipComponentParams: {\n            style: {\n              align: 'left',\n              fontSize: 12,\n              fontColor: '',\n              fontStyle: 'normal',\n              decoration: '',\n              letterSpacing: '',\n              lineHeight: '16.5',\n              display: 'auto'\n            },\n            header: true,\n          },\n          headerComponentParams: {\n            style: curStyle,\n            show: titleShow,\n            maxHeight,\n            cellBorderWidth,\n            borderTopShow: '1',\n            innerBorderColor: innerBorderColor\n          },\n          cellStyle: (params) => {\n            // params.value\n            let style = params.data.columnStyle;\n            let height = 0;\n            if (mode === 'full' || mode === 'fitHeight') {\n              if (currentRowHeight) {\n                height = currentRowHeight + 'px';\n              }\n            } else {\n              height = style.height + 'px';\n            }\n            return retHeadCellStyle(height);\n          }\n        });\n      }\n      if (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(colCategory)) {\n        if (columnAggression.length > 0) {\n          resColumn.push(...getGridColumn(geneColumnAgg(true)));\n        } else {\n          resColumn.push(...getGridColumn(partColumn));\n        }\n      } else {\n        resColumn.push(...getGridColumn(partColumn));\n      }\n      return resColumn;\n    }\n\n    function retHeadCellStyle (height, params) {\n      let curStyle = {\n        borderWidth: cellBorderWidth + 'px'\n      };\n      if (height) {\n        curStyle.height = height + ' !important';\n        curStyle.lineHeight = height;\n      }\n      if (bgColor && bgColor.indexOf('/') > -1) {\n        if (index === 15) {\n          curStyle.background = '#2b0b0b';\n        } else if (index === 17) {\n          curStyle.background = 'rgb(3,18,49)';\n        } else {\n          curStyle.backgroundImage = `url(${bgColor})`;\n          curStyle.backgroundSize = `${width}px ${height}px`; // 可以使用cover\n          curStyle.backgroundPosition = 'top right'; // 背景图片居中显示，让多余部分相对容器对此展示\n          curStyle.backgroundRepeat = 'no-repeat';\n        }\n      } else {\n        curStyle.background = bgColor || '#fff';\n      }\n      curStyle.opacity = config.table.background.opacity\n        ? (config.table.background.opacity * 100) / 100\n        : 1;\n      curStyle.borderColor = innerBorderColor;\n      curStyle.color = config.font.color;\n      if (params && params.value && params.value.rowSpan !== params.value.rowLen) {\n        curStyle.display = 'none';\n      }\n      return curStyle;\n    }\n\n    function getGridColumn (column) {\n      let resColumn = [];\n\n      let rowCat = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data.row.aggressions)\n        ? Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isEmpty\"])(config.data_labeled)\n          ? []\n          : config.data.labeled\n        : config.data.row.aggressions;\n\n      maxHeight = maxHeight ? maxHeight + 16 : Number(titleStyle.lineHeight);\n\n      function gridColumnProcess (original, target, propName) {\n        original.forEach((parent, idx) => {\n          let temColumnObj = {\n            tooltipComponent: 'customTooltip',\n            headerName: parent.title ? parent.title : parent.key,\n            headerTooltip: parent.title ? parent.title : parent.key,\n            resizable: false,\n            headerGroupComponent: createHeaderGroupComponent(),\n            headerGroupComponentParams: {\n              style: titleStyle,\n              show: true,\n              maxHeight,\n              cellBorderWidth,\n              innerBorderColor: innerBorderColor,\n              borderBottomShow: titleShow ? '1' : '0', // 无\n              borderTopShow: titleShow ? '0' : '1' // 无\n            },\n            headerComponentParams: {\n              style: parent.parentTitleStyle\n                ? parent.parentTitleStyle\n                : titleStyle,\n              // className: hideHeadFlag ? 'hide-head' : '',\n              show: parent.show !== '1',\n              maxHeight,\n              innerBorderColor: innerBorderColor,\n              cellBorderWidth,\n              borderTopShow: titleShow ? '0' : '1' // 无\n            },\n            tooltipComponentParams: {\n              context: {dataProcess: _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"]},\n            },\n            cellRenderer: (params) => {\n              var eDiv = document.createElement('span');\n              eDiv.innerHTML =\n                params.value && (params.value.value || params.value.value === 0)\n                  ? params.value.value\n                  : '';\n              params.eGridCell.addEventListener('click', function () {\n                let label = params.value && params.value.label;\n                let obj = {};\n                label.forEach((i) => {\n                  obj[i.name] = i.value;\n                });\n                typeof config.data_click === 'function' &&\n                  config.data_click(obj);\n              });\n\n              return eDiv;\n            },\n            // cellRenderer: (params) => {\n            //   return params.value && (params.value.value || params.value.value === 0) ? params.value.value : ''\n            // },\n            cellStyle: (params) => {\n              let style = {};\n              if (params.columnStyle) {\n                style = JSON.parse(JSON.stringify(params.columnStyle));\n              }\n              if (params.value) {\n                if (params.value.columnStyle) {\n                  style = JSON.parse(JSON.stringify(params.value.columnStyle));\n                }\n                style.height = style.height + 'px !important';\n                // && colorFeature === params.data.data_row_aggressions\n                if (\n                  colorFeature &&\n                  params.value &&\n                  (params.value.value || params.value.value === 0)\n                ) {\n                  style.color = getColor(params.value.labelValue);\n                } else if (!colorFeature) {\n                } else {\n                  style.color = config.font_color;\n                }\n              }\n              if (mode === 'full' || mode === 'fitHeight') {\n                if (currentRowHeight) {\n                  style.height = currentRowHeight + 'px !important';\n                  style.lineHeight = currentRowHeight + 'px !important';\n                }\n              }\n              let opacity = config.color_opacity ? config.color_opacity[0] : 1;\n              style.borderWidth = cellBorderWidth + 'px';\n              style.borderRightColor = innerBorderColor + ' !important';\n              style.borderBottomColor = innerBorderColor + ' !important';\n              if (colorFeature) {\n                style.opacity = (opacity * 100) / 100;\n              } else {\n                style.opacity = '100%';\n              }\n\n              return style;\n            }\n          };\n          if (parent.key) {\n            propName.push(parent.key);\n            if (parent.values[0].key) {\n              temColumnObj.children = gridColumnProcess(\n                parent.values,\n                temColumnObj.columns || [],\n                propName\n              );\n            } else {\n              if (columnAggression.length > 0 && parent.type !== 'columnAgg') {\n                let colAggValues = geneColumnAgg();\n                temColumnObj.children = gridColumnProcess(\n                  colAggValues,\n                  temColumnObj.columns || [],\n                  propName\n                );\n              }\n\n              temColumnObj.field = propName\n                .join('-')\n                .replace(/,/g, '')\n                .replace(/\\(/g, '')\n                .replace(/\\)/g, '')\n                .replace(/\\s+/g, '')\n                .replace(/\\./, ''); // parent.key;\n              temColumnObj.tooltipField = temColumnObj.field;\n            }\n            propName.pop();\n            target.push(temColumnObj);\n          } else {\n            if (idx === 0 && rowCat.length > 0) {\n              temColumnObj.field = 'singleHead';\n              temColumnObj.tooltipField = 'singleHead';\n              temColumnObj.headerComponentParams.show = false;\n              singleHeadFlag =\n                config.data.row.categories.length > 0 ? false : true;\n              // temColumnObj.headerComponentParams.hasSpace = '1'\n              temColumnObj.headerComponentParams.maxHeight = 0;\n              target.push(temColumnObj);\n            }\n          }\n        });\n        return target;\n      }\n      let propName = [];\n      resColumn = gridColumnProcess(column, resColumn, propName);\n      if (titleShow) {\n        let obj = {\n          tooltipComponent: 'customTooltip',\n          headerName: titleMatch ? titleMatch.title : titleKey,\n          headerTooltip: titleMatch ? titleMatch.title : titleKey,\n          children: resColumn,\n          tooltipComponentParams: {\n            context: {dataProcess: _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"]},\n          },\n          headerGroupComponent: createHeaderGroupComponent(),\n          headerGroupComponentParams: {\n            style: titleStyle,\n            show: titleShow,\n            maxHeight,\n            cellBorderWidth,\n            innerBorderColor: innerBorderColor,\n            borderBottomShow: '1', // 无\n            borderTopShow: '1' // 无\n          }\n        };\n        return [obj];\n      } else {\n        return resColumn;\n      }\n    }\n\n    function geneColumnAgg (useStyleFlag) {\n      let colAggValues = [];\n      let curStyle = {\n        align: 'left',\n        fontSize: 12,\n        fontColor: '',\n        fontStyle: 'normal',\n        decoration: '',\n        letterSpacing: '',\n        lineHeight: '16.5',\n        display: 'auto'\n      };\n      if (tableTitle.length > 0) {\n        curStyle = tableTitle[0].style;\n        curStyle.color = curStyle.fill;\n      }\n      columnAggression.map((i) => {\n        let match = tableTitle.find((m) => m.key === i);\n        let flag = (match && match.show) || !match;\n        colAggValues.push({\n          title: match ? match.title : i,\n          key: i,\n          values: [{}],\n          type: 'columnAgg',\n          show: flag ? '' : '1',\n          parentTitleStyle: useStyleFlag ? curStyle : null\n        });\n      });\n      return colAggValues;\n    }\n\n    function getColumn (colCategory) {\n      // colCategory = ['品牌', '产品主类']\n      let nest = d3.nest();\n      for (var i = 0; i < colCategory.length; i++) {\n        nest.key(createNestingFunction(colCategory[i]));\n        // nest.key((d)=> {\n        //   return d[colCategory[i]];\n        // });\n      }\n      let resData = nest.entries(tableData);\n      return resData;\n    }\n\n    function createNestingFunction(propertyName) {\n      return (d)=> {\n        return d[propertyName];\n      };\n    }\n    /////////////////////结束获取grid的column////////////////////////\n  };\n\n  function initData (values) {\n    data = values;\n    keys = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isDefined\"])(colored_feature)\n      ? $$.getUniqueArray(data.map((d) => d.values[0][colored_feature]))\n      : [];\n  }\n\n  function getColorList() {\n    // $$.modifyColorList({\n    //   colored_type: colored_type,\n    //   colored_feature: colored_feature,\n    //   keys: keys,\n    // });\n  }\n\n  function getColor (value) {\n    if (value) {\n      let y_colored = [];\n      let colorRange = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"notEmpty\"])(config.data.range.color) ? config.data.range.color[0] : [],\n        color_schemes = ['#7AC9F5', '#2A5783'],\n        colors = (Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"notEmpty\"])(config.color.colors) && config.color.colors[0]) ? config.color.colors[0] : [],\n        colored_type = config.data.colored.type,\n        colored_feature = config.data.colored.feature;\n      let pattern = d3.scaleOrdinal(color_schemes).range(); //d3.schemeSet3, schemeCategory10\n      y_colored = d3.extent((tableData).map((d) => d[colored_feature]));\n      if(Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isDefined\"])(colorRange[0]) && colorRange[0] !== null) y_colored[0] = Number(colorRange[0])\n      if(Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isDefined\"])(colorRange[1]) && colorRange[1] !== null) y_colored[1] = Number(colorRange[1])\n\n      let min = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isDefined\"])(y_colored[0]) ? y_colored[0] : 0;\n      let max = Object(_utils_check_js__WEBPACK_IMPORTED_MODULE_0__[\"isDefined\"])(y_colored[1]) ? y_colored[1] : min;\n\n      pattern = d3.scaleLinear().range(color_schemes).domain([min, max]).clamp(true);\n      let color = pattern(value);\n      return color;\n    }\n  }\n\n  return {\n    drawTable,\n    getColorList,\n    initData,\n    getColor\n  };\n};\n// extend(Chart.prototype, {\n//   drawTable,\n// });\n\n\n//# sourceURL=webpack://chart/./src/chart/table.js?");

/***/ }),

/***/ "./src/geometry/Bubble.js":
/*!********************************!*\
  !*** ./src/geometry/Bubble.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* harmony import */ var _Geometry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Geometry.js */ \"./src/geometry/Geometry.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\n\nlet { defaultFormat, defaultText } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"];\nclass Bubble extends _Geometry_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.init();\n    this.colorList = [];\n  }\n\n  init () {\n    this.createContainer();\n  }\n\n  labelsConfig () {\n    let list = this.config.labelsList;\n    if (list.length === 0) {\n      return;\n    }\n    let dpr = this.config.dpr || 1;\n    this.geometry.selectAll('.bubble-labels').remove();\n    let textDom = this.geometry\n      .append('text')\n      .attr('class', 'bubble-labels')\n      .attr('text-anchor', 'middle')\n      .attr('startOffset', '50%')\n      .attr('textLength', (d) => d.radius)\n      .attr(\n        'transform',\n        (d) =>\n          `translate(0, -${\n            list.reduce((a, b) => a + b.text.lineHeight, 0) / 2\n          })`\n      );\n    textDom\n      .selectAll('tspan')\n      .data((d) => {\n        let tempList = list\n          .map((l) => {\n            let { format = defaultFormat } = l;\n            return {\n              ...d,\n              key: l.key,\n              title: l.title,\n              format: l.format,\n              text: l.text || defaultText,\n              formatVal: Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"dataProcess\"])(d[l.key], format)\n            };\n          })\n          .filter(\n            (f) =>\n              Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__[\"getTextWidth\"])(f.formatVal, f.text.fontSize + 'px') * dpr <\n              d.radius * 2 * 0.7\n          );\n        let totalHeight = tempList.reduce((a, b) => {\n          return a + b.text.lineHeight;\n        }, 0);\n        if (totalHeight > d.radius * 2 * 0.7) {\n          tempList = tempList.slice(0, 2);\n        }\n        return tempList;\n      })\n      .enter()\n      .append('tspan')\n      .attr('x', (d) => 0)\n      .attr('dy', (d) => `${d.text.lineHeight}px`)\n      .attr('fill', (d) => d.text.fontColor)\n      .attr('font-size', (d) => d.text.fontSize)\n      .text((d) => d.formatVal);\n  }\n\n  draw () {\n    let { size, width, height, colorFeature, orderStyle } = this.config;\n    let pack = d3.pack().size([width * size, height * size]);\n    let root = d3\n      .hierarchy({\n        children: this.data\n      })\n      .sum((d) => {\n        return d[this.config.sizeFeature.feature];\n      });\n    if (orderStyle === -1) {\n      root.sort((a, b) => b.value - a.value);\n    } else if (orderStyle === 1) {\n      root.sort((a, b) => a.value - b.value);\n    } else {\n      root.sort(() => Math.random() * 2 - 1);\n    }\n    let colorList = [];\n    var nodes = pack(root)\n      .leaves()\n      .map((d, idx) => {\n        let colorVal = colorFeature.feature;\n        let val = colorFeature.type === 'ordinal' ? d.data[colorVal] : d.value;\n        let color = this.getItemColor(idx, val);\n\n        if (colorFeature.feature) {\n          let match = colorList.find(\n            (i) => i.val === d.data[colorFeature.feature]\n          );\n\n          !match &&\n            colorList.push({\n              val: d.data[colorFeature.feature],\n              color\n            });\n        }\n        return {\n          x: d.x,\n          y: d.y,\n          r: d.r,\n          color,\n          id: 'bubble-circle' + idx,\n          radius: d.r,\n          value: d.value,\n          ...d.data\n        };\n      });\n    this.colorList = colorList;\n    this.className = 'bubble-circle';\n    this.geometry = this.svg\n      .append('g')\n      .attr('class', 'bubble-wrap')\n      .attr(\n        'transform',\n        `translate(${(width - width * size) / 2},${\n          (height - height * size) / 2\n        })`\n      )\n      .selectAll('bubble-circle')\n      .data(nodes)\n      .enter()\n      .append('g')\n      .attr('id', (d) => d.id)\n      .attr('transform', (d) => `translate(${d.x},${d.y})`);\n\n    this.geometry\n      .append('circle')\n      .attr('cx', 0)\n      .attr('cy', 0)\n      .attr('r', (d) => d.r)\n      .attr('fill', (d) => d.color);\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Bubble);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Bubble.js?");

/***/ }),

/***/ "./src/geometry/Geometry.js":
/*!**********************************!*\
  !*** ./src/geometry/Geometry.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_color_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/color.js */ \"./src/utils/color.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n\n\n\nlet { defaultText, defaultFormat, fontColor } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nclass Geometry {\n  constructor (data, config) {\n    this.data = data;\n    this.config = config;\n    this.container = null;\n    this.geometry = null;\n  }\n\n  /**\n   * 创建容器\n   */\n  createContainer () {\n    let { id, width, height } = this.config;\n    this.container = d3\n      .select(`#${id}`)\n      .append('div')\n      .attr('class', 'chart-container')\n      .attr(\n        'style',\n        `width:${width}px;height:${height}px;position:relative;display:inline-block;vertical-align:middle`\n      );\n\n    // 待补充\n    this.svg = this.container\n      .append('svg')\n      .attr('width', width)\n      .attr('height', height);\n    // .attr('transform', 'translate(10,10)');\n  }\n\n  /**\n   * 标签配置\n   */\n  labelsConfig () {}\n\n  /**\n   * 提示框配置\n   */\n  tooltipConfig () {\n    if (!this.geometry) {\n      return;\n    }\n    let list = this.config.tooltipList;\n    if (list.length === 0) {\n      return;\n    }\n    // let { width, height } = this.config;\n    let tooltipWrap;\n    let style = `\n    position:absolute;\n    z-index:7;\n    transition:left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;\n    padding:8px 12px;\n    color:${fontColor};\n    background: #fff;\n  box-shadow: rgb(174, 174, 174) 0px 0px 10px;\n  border-radius: 3px;`;\n\n    this.geometry.on('mouseover', (d) => {\n      if (list.length === 0) {\n        return;\n      }\n      tooltipContentProcess(d);\n    });\n\n    this.geometry.on('mouseout', () => {\n      // this.container.selectAll('.dc-tooltip').remove();\n      d3.select('body').selectAll('.dc-tooltip').remove();\n    });\n\n    this.geometry.on('mousemove', () => {\n      let { left, top, translateX } = retLeftTop();\n      let curStyle =\n        style +\n        ` left:${left}px;top:${top}px;transform:translateX(${translateX}`;\n      // this.container.selectAll('.dc-tooltip').attr('style', curStyle);\n      d3.select('body').selectAll('.dc-tooltip').attr('style', curStyle);\n    });\n\n    function retLeftTop () {\n      let { clientWidth: tempWidth, clientHeight: tempHeight } = document.body;\n      let translateX = 0;\n      let left = event.x + 20;\n      let top = event.pageY + 20;\n\n      if (top + list.length * 30 > tempHeight) {\n        top = top - list.length > 0 ? top - list.length * 30 : 0;\n      }\n      if (left + 150 > tempWidth) {\n        left = left - 150 > 0 ? left - 30 : 0;\n        translateX = '-100%';\n      }\n      return {\n        left,\n        top,\n        translateX\n      };\n    }\n\n    function tooltipContentProcess (d) {\n      // 鼠标的offsetX offsetY\n      // 弹框最大高度  30 * list.length\n      // 容器的高度\n      let { left, top, translateX } = retLeftTop();\n      let curStyle =\n        style +\n        ` left:${left}px;top:${top}px;transform:translateX(${translateX})`;\n\n      tooltipWrap = d3\n        .select('body') //  this.container //\n        .append('div')\n        .attr('class', 'dc-tooltip')\n        .attr('style', curStyle);\n\n      let listItem = '';\n      list.forEach((item) => {\n        let prop = item.title;\n        let val = d[item.key];\n        let { text = defaultText, format = defaultFormat } = item;\n        if (item.display !== 'none') {\n          let curStyleObj = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"styleProcess\"])(text);\n          let retVal = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"])(val, format);\n          Object.assign(curStyleObj, {\n            display: 'inline-flex',\n            flex: 1,\n            justifyContent: 'space-between'\n          });\n          listItem += `<li class=\"dc-tooltip-list-item\" style=\"margin-bottom:4px;display:flex;align-items: center;\">\n            <span style=\"${curStyleObj}\">\n            <span >${prop}:</span>\n            <span>${retVal}</span>\n            </span>\n            </li>`;\n        }\n      });\n      tooltipWrap.html(listItem);\n    }\n  }\n\n  registerEvent (eventType) {\n    if (!this.geometry) {\n      return;\n    }\n    let that = this;\n    this.geometry.on(\n      eventType,\n      function (d) {\n        // 待修改selectAll(`.${that.className}`)\n        d3.event.stopPropagation();\n        that.geometry.attr('opacity', that.config.opacity * 0.2);\n        d3.select(this).transition().duration(500).attr('opacity', 1);\n        that.config.clkFlag = true;\n        typeof that.config.data_click === 'function' &&\n          that.config.data_click(d);\n      },\n      false\n    );\n\n    this.container.on(\n      eventType,\n      function (d) {\n        // 待修改selectAll(`.${that.className}`)\n        that.geometry.attr('opacity', that.config.opacity);\n        if (that.config.clkFlag) {\n          typeof that.config.data_click === 'function' &&\n            that.config.data_click();\n          that.config.clkFlag = false;\n        }\n      },\n      false\n    );\n  }\n\n  /**\n   * 画图形\n   */\n  render () {\n    this.draw();\n    this.labelsConfig();\n    this.tooltipConfig();\n    this.registerEvent('click');\n  }\n\n  getItemColor (index, curVal) {\n    let { type, feature } = this.config.colorFeature;\n    let min = 0;\n    let max = 0;\n    if (type === 'linear') {\n      let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n      min = sortData[0][feature];\n      max = sortData[sortData.length - 1][feature];\n      if (this.data.length === 1) {\n        if (min > 0) {\n          min = 0;\n        } else {\n          max = 0;\n        }\n      }\n    }\n\n    return Object(_utils_color_js__WEBPACK_IMPORTED_MODULE_0__[\"getItemColor\"])(\n      index,\n      this.config.colorList,\n      this.config.colorFeature.type,\n      min,\n      max,\n      curVal,\n      feature\n    );\n  }\n\n  update (type, data) {\n    let updateFun = {\n      tooltip: () => {\n        this.config.tooltipList = data;\n        this.tooltipConfig();\n      },\n      labels: () => {\n        this.config.labelsList = data;\n        this.labelsConfig();\n      }\n    };\n\n    if (typeof updateFun[type] === 'function') {\n      updateFun[type]();\n    }\n  }\n\n  getColorList () {\n    let { colorFeature, colorOpacity } = this.config;\n    if (!colorFeature.feature) {\n      return [];\n    }\n    if (!this.colorList || this.colorList.length === 0) {\n      return [];\n    }\n    let colorList = [];\n    let obj = {};\n    obj.key = colorFeature;\n    obj.opacity = colorOpacity;\n    obj.list = [];\n    obj.name = colorFeature.feature;\n    obj.colored_type = colorFeature.type;\n    /**\n     * 处理数据 取最大值和最小值\n     */\n    if (colorFeature.type === 'linear') {\n      let sortList = this.colorList\n        .filter((i) => typeof i.val !== 'undefined')\n        .sort((a, b) => a.val - b.val);\n      let minObj = sortList[0];\n      minObj.rangeType = 'min';\n      minObj.originalVal = minObj.val;\n      minObj.val = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"toScientificNotation\"])(minObj.val);\n      minObj.color = this.getItemColor(0, minObj.val);\n      let maxObj = JSON.parse(JSON.stringify(sortList[0]));\n      if (sortList.length > 1) {\n        maxObj.originalVal = sortList[sortList.length - 1].val;\n      }\n      maxObj.color = this.getItemColor(1, maxObj.originalVal);\n      maxObj.rangeType = 'max';\n      maxObj.val = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"toScientificNotation\"])(maxObj.originalVal);\n\n      obj.list = [minObj, maxObj];\n    } else {\n      obj.list = this.colorList;\n    }\n    colorList.push(obj);\n    return colorList;\n  }\n\n  getDomain () {}\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Geometry);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Geometry.js?");

/***/ }),

/***/ "./src/geometry/GeometryWithAxis.js":
/*!******************************************!*\
  !*** ./src/geometry/GeometryWithAxis.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Geometry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Geometry.js */ \"./src/geometry/Geometry.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\nlet { defaultText, defaultLineStyle } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\nclass GeometryWithAxis extends _Geometry_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.xScale = null;\n    this.yScale = null;\n    this.xAxisG = null;\n    this.yAxisG = null;\n    this.dpr = this.config.dpr || 1;\n    this.fontSizeLineHeightPair = JSON.parse(\n      JSON.stringify(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"])\n    );\n    if (this.dpr !== 1) {\n      this.initFontSizeLineHeight();\n    }\n  }\n\n  initFontSizeLineHeight () {\n    for (const key in _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"]) {\n      if (Object.hasOwnProperty.call(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"], key)) {\n        const ele = _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"fontSizeLineHeightPair\"][key];\n        this.fontSizeLineHeightPair[key * this.config.dpr] =\n          ele * this.config.dpr;\n      }\n    }\n  }\n\n  /**\n   * 定义比例尺\n   */\n  xScaleConfig () {\n    this.xScale = d3\n      .scaleLinear()\n      .domain(this.getMinMaxData(this.config.xAxis.title.value)); // 待修改\n    this.xScale.nice();\n  }\n\n  yScaleConfig () {\n    this.ticksProcess();\n    let {\n      yTitleWidth,\n      yLabelWidth,\n      xLabelWidth,\n      labelHeight,\n      titleHeight\n    } = this.getTransformData();\n\n    this.xScale\n      .range([\n        yTitleWidth + yLabelWidth + (6 + 4) * (this.config.dpr || 1),\n        this.config.width - xLabelWidth\n      ])\n      .nice();\n\n    this.yScale\n      .range([\n        this.config.height -\n          labelHeight -\n          titleHeight -\n          (6 + 4) * (this.config.dpr || 1),\n        // -  (this.xLabelWidth * 2) / 3,\n        labelHeight // + yLabelWidth / 2\n      ]) // 半个字体高度\n      .nice();\n\n    this.xAxisConfig(labelHeight, titleHeight);\n\n    this.yAxisConfig(yLabelWidth, yTitleWidth);\n\n    this.xTitleConfig(labelHeight);\n\n    this.yTitleConfig(labelHeight, titleHeight, yTitleWidth, yLabelWidth);\n\n    this.gridLineConfig();\n    this.diagonalLineConfig();\n  }\n\n  ticksProcess () {\n    let {\n      scopeObj: {\n        scale,\n        select,\n        tick_range: tickRange,\n        tick_counts: tickCounts\n      }\n    } = this.config;\n    let originalRange = this.getMinMaxData(this.config.yAxis.title.value);\n    if (scale === 1 || select === 0) {\n      this.yScale = d3.scaleLinear().domain(originalRange); // 待修改\n      return;\n    }\n    if (select === 3) {\n      this.yScale = d3\n        .scaleLinear()\n        .domain(typeof tickRange[0] !== 'undefined' ? tickRange : originalRange)\n        .ticks(tickCounts);\n      return;\n    }\n    if (select === 1) {\n      let min =\n        typeof tickRange[0] !== 'undefined' ? tickRange[0] : originalRange[0];\n      let max =\n        typeof tickRange[0] !== 'undefined' ? tickRange[1] : originalRange[1];\n      if (scale < 1) {\n        let newMin = max - (max - min) / scale;\n        this.yScale = d3.scaleLinear().domain([newMin, max]).nice();\n      } else {\n        let newMax = scale * (max - min) + min;\n        this.yScale = d3.scaleLinear().domain([min, newMax]).nice();\n      }\n    }\n  }\n\n  getMinMaxData (feature) {\n    if (this.data.length === 1) {\n      if (this.data[0][feature] > 0) {\n        return [0, this.data[0][feature]];\n      } else {\n        return [this.data[0][feature], 0];\n      }\n    }\n    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n    let min = sortData[0][feature];\n    let max = sortData[sortData.length - 1][feature];\n\n    return [min, max];\n  }\n\n  /**\n   *\n   */\n  getTransformData () {\n    let { hasUnit } = this.config;\n    let {\n      title: { style = defaultText, value },\n      label: { style: labelStyle = defaultText }\n    } = this.config.yAxis;\n\n    let yTitleWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(value, style.fontSize + 'px');\n    let yTicks = this.yScale.ticks();\n    let yMaxLabel = yTicks[yTicks.length - 1];\n    let yLabelWidth =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(yMaxLabel, labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n\n    let xTicks = this.xScale.ticks();\n    let xMaxLabel = xTicks[xTicks.length - 1];\n\n    let xLabelWidth =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(xMaxLabel, labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n\n    if (hasUnit) {\n      yLabelWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(\n        d3.format('~s')(yMaxLabel),\n        labelStyle.fontSize + 'px'\n      );\n      xLabelWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(\n        d3.format('~s')(xMaxLabel),\n        labelStyle.fontSize + 'px'\n      );\n    }\n    let { label, title } = this.config.xAxis;\n\n    let labelHeight = this.fontSizeLineHeightPair[label.style.fontSize];\n    let titleHeight = this.fontSizeLineHeightPair[title.style.fontSize];\n    if (labelStyle.rotate === -45) {\n    } else if (labelStyle.rotate === 45) {\n      labelHeight += yLabelWidth / 2;\n    }\n\n    if (label.style.rotate === -45 || label.style.rotate === 45) {\n      titleHeight += xLabelWidth / 2;\n    }\n    // titleHeight = titleHeight + titleHeight / 2;\n\n    this.yTitleWidth = yTitleWidth;\n    this.yLabelWidth = yLabelWidth;\n    this.xLabelWidth = xLabelWidth;\n    this.labelHeight = labelHeight;\n    this.titleHeight = titleHeight;\n    return {\n      yTitleWidth,\n      yLabelWidth,\n      xLabelWidth,\n      labelHeight,\n      titleHeight\n    };\n  }\n\n  /**\n   * 定义坐标轴\n   */\n  xAxisConfig (labelHeight, titleHeight) {\n    let {\n      hasUnit,\n      xAxis: {\n        label: { style: labelStyle = {} }\n      }\n    } = this.config;\n    let ticks = this.xScale.ticks();\n    let width =\n      Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(ticks[ticks.length - 1], labelStyle.fontSize + 'px') *\n      (this.config.dpr || 1);\n    let len = parseInt(Math.round(ticks.length / (this.config.width / width)));\n    len = len ? len + 1 : 1;\n    let xAxis = d3.axisBottom(this.xScale).tickFormat((d, idx) => {\n      if (idx % len === 0) {\n        let val = d;\n        if (hasUnit) {\n          val = d3.format('~s')(d);\n        }\n        return val;\n      } else {\n        return '';\n      }\n    });\n    this.xAxisG = this.svg\n      .append('g')\n      .attr('class', 'x-axis')\n      .attr(\n        'transform',\n        `translate(0,${\n          this.config.height -\n          labelHeight -\n          titleHeight -\n          (6 + 4) * (this.config.dpr || 1)\n          //  -  (this.xLabelWidth * 2) / 3\n        })`\n      );\n\n    this.xAxisG.call(xAxis);\n\n    this.setAxisStyle(this.config.xAxis, 'x');\n  }\n\n  setAxisStyle (AxisConfig, type) {\n    let {\n      tickLine: { style: tickLineStyle = defaultLineStyle },\n      line: { style: lineStyle = defaultLineStyle, show: showLine },\n      label: { style: labelStyle = defaultLineStyle }\n    } = AxisConfig;\n\n    console.log(lineStyle);\n    let AxisG = this[type + 'AxisG'];\n    let { rotate } = labelStyle;\n    let transformValue = `rotate(${rotate})`;\n    if (rotate !== 0 && rotate !== 90) {\n      if (type === 'x') {\n        transformValue += `translate(${\n          rotate < 0 ? (-this.xLabelWidth * 2) / 3 : (this.xLabelWidth * 2) / 3\n        },${rotate > 0 ? -7 : 0})`;\n      } else {\n        transformValue += `translate(0,${\n          rotate < 0 ? -this.yLabelWidth / 4 : this.yLabelWidth / 4\n        })`;\n      }\n    } else if (rotate === 90) {\n      if (type === 'x') {\n        transformValue += `translate(${this.xLabelWidth + 7},-10)`;\n      } else {\n        transformValue += `translate(${this.yLabelWidth},${this.yLabelWidth})`;\n      }\n    }\n    AxisG.selectAll('text')\n      .attr('transform', transformValue)\n      .attr('stroke', 'none')\n      .attr('fill', labelStyle.fontColor)\n      .attr('font-size', labelStyle.fontSize)\n      .attr('font-weight', labelStyle.fontWeight)\n      .attr('font-style', labelStyle.fontStyle);\n\n    AxisG.selectAll('line')\n      .attr('stroke', tickLineStyle.fontColor)\n      .attr('stroke-opacity', tickLineStyle.opacity || 1)\n      .attr('stroke-width', tickLineStyle.lineWidth);\n\n    if (!showLine) {\n      AxisG.selectAll('path').remove();\n      return;\n    }\n    AxisG.selectAll('path')\n      .attr('stroke', lineStyle.fontColor)\n      .attr('stroke-width', lineStyle.lineWidth)\n      .attr('stroke-opacity', lineStyle.opacity)\n      .attr('stroke-dasharray', lineStyle.lineDash);\n  }\n\n  yAxisConfig (yLabelWidth, yTitleWidth) {\n    let {\n      hasUnit,\n      yAxis: {\n        label: { style: labelStyle = {} }\n      },\n      scopeObj: { select }\n    } = this.config;\n    let yAxis = null;\n    if (select !== 3) {\n      let ticks = this.yScale.ticks();\n      let height =\n        Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(ticks[ticks.length - 1], labelStyle.fontSize + 'px') *\n        (this.config.dpr || 1);\n      if (labelStyle.rotate === 0) {\n        height = 48;\n      } else if (labelStyle.rotate === 45 || labelStyle.rotate === -45) {\n        height = height / 2;\n      }\n      let len = parseInt(\n        Math.round(ticks.length / (this.config.height / height))\n      );\n      len = len ? len + 1 : 1;\n      yAxis = d3.axisLeft(this.yScale).tickFormat((d, idx) => {\n        if (idx % len === 0) {\n          let val = d;\n          if (hasUnit) {\n            val = d3.format('~s')(d);\n          }\n          return val;\n        } else {\n          return '';\n        }\n      });\n    } else {\n      yAxis = d3.axisLeft(this.yScale);\n    }\n\n    // let yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {\n    //   if (hasUnit) {\n    //     return d3.format('~s')(d);\n    //   }\n    //   return d;\n    // });\n\n    this.yAxisG = this.svg\n      .append('g')\n      .attr('class', 'y-axis')\n      .attr(\n        'transform',\n        `translate(${\n          yLabelWidth + yTitleWidth + (6 + 4) * (this.config.dpr || 1)\n        },0)`\n      );\n\n    this.yAxisG.call(yAxis);\n\n    this.setAxisStyle(this.config.yAxis, 'y');\n  }\n\n  xTitleConfig (labelHeight) {\n    let {\n      title: { value, style = defaultText, show: showTitle }\n    } = this.config.xAxis;\n    if (!showTitle) {\n      return;\n    }\n    let xTitleWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(value, style.fontSize + 'px') * this.dpr;\n\n    this.xAxisG\n      .append('text')\n      .attr('class', 'x-title')\n      .attr(\n        'transform',\n        `translate(${this.config.width - xTitleWidth},${\n          labelHeight + (6 + 2) * (this.config.dpr || 1) + labelHeight / 2\n          // + (this.xLabelWidth * 2) / 3\n        })`\n      )\n      .attr('stroke', 'none')\n      .attr('fill', style.fontColor)\n      .attr('font-size', style.fontSize)\n      .attr('font-weight', style.fontWeight)\n      .attr('font-style', style.fontStyle)\n      .attr('text-decoration', style.textDecoration)\n      .text(value);\n  }\n\n  yTitleConfig (labelHeight, titleHeight, yTitleWidth, yLabelWidth) {\n    let {\n      title: { style = defaultText, value, show: showTitle }\n    } = this.config.yAxis;\n    // let { style = defaultText } = title;\n    if (!showTitle) {\n      return;\n    }\n    let curHeight = this.fontSizeLineHeightPair[style.fontSize] * value.length;\n    //\n    this.yAxisG\n      .append('text')\n      .attr('class', 'y-title')\n      .attr(\n        'transform',\n        `translate(${\n          -yTitleWidth / 2 - yLabelWidth - (6 + 8) * (this.config.dpr * 2 / 3 || 1)\n        },${curHeight - labelHeight + labelHeight / 2 - titleHeight})`\n      )\n      .attr('writing-mode', 'tb')\n      .attr('stroke', 'none')\n      .attr('fill', style.fontColor)\n      .attr('font-size', style.fontSize)\n      .attr('font-weight', style.fontWeight)\n      .attr('font-style', style.fontStyle)\n      .attr('text-decoration', style.textDecoration)\n      .text(value);\n  }\n\n  diagonalLineConfig () {\n    let xTicks = this.xScale.ticks();\n    let yTicks = this.yScale.ticks();\n\n    let that = this;\n    that.svg\n      .append('g')\n      .attr('class', 'diagonal-line')\n      .selectAll('line')\n      .data([1])\n      .enter()\n      .append('line')\n      .attr('x1', () => that.xScale(xTicks[0]))\n      .attr('y1', () => that.yScale(yTicks[0]))\n      .attr('x2', () => that.xScale(xTicks[xTicks.length - 1]))\n      .attr('y2', () => that.yScale(yTicks[yTicks.length - 1]))\n      .attr('fill', 'none')\n      .attr('stroke', '#c2c9d1')\n      .attr('stroke-opacity', 1)\n      .attr('stroke-width', 1);\n  }\n\n  /**\n   * 网格线\n   */\n  gridLineConfig () {\n    let {\n      line: { style = {}, show }\n    } = this.config.yAxis.grid || {};\n    if (!show) {\n      return;\n    }\n    let {\n      line: { style: xLineStyle = {} }\n    } = this.config.xAxis.grid || {};\n\n    let that = this;\n    let xTicks = this.xScale.ticks();\n    let yTicks = this.yScale.ticks();\n\n    drawGridLine('y-grid-line', xTicks, style)\n      .attr('x1', (d) => that.xScale(d)) // + config.xOffset\n      .attr('x2', (d) => that.xScale(d))\n      .attr('y1', that.yScale(yTicks[0]))\n      .attr('y2', that.yScale(yTicks[yTicks.length - 1]));\n\n    drawGridLine('x-grid-line', yTicks, xLineStyle)\n      .attr('y1', (d) => that.yScale(d)) // + config.xOffset\n      .attr('y2', (d) => that.yScale(d))\n      .attr('x1', that.xScale(xTicks[0]))\n      .attr('x2', that.xScale(xTicks[xTicks.length - 1]));\n\n    function drawGridLine (className, ticks, curStyle) {\n      return that.svg\n        .append('g')\n        .attr('class', className)\n        .selectAll('line')\n        .data(ticks)\n        .enter()\n        .append('line')\n        .attr('class', 'grid-line-item')\n        .attr('stroke', curStyle.fontColor || '#c2c9d1')\n        .attr('stroke-width', curStyle.lineWidth || 1)\n        .attr('stroke-opacity', curStyle.opacity || 1)\n        .attr('stroke-dasharray', curStyle.lineDash || [0, 0])\n        .attr('fill', 'none');\n    }\n  }\n\n  draw () {}\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (GeometryWithAxis);\n\n\n//# sourceURL=webpack://chart/./src/geometry/GeometryWithAxis.js?");

/***/ }),

/***/ "./src/geometry/Scatter.js":
/*!*********************************!*\
  !*** ./src/geometry/Scatter.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _GeometryWithAxis_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GeometryWithAxis.js */ \"./src/geometry/GeometryWithAxis.js\");\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n/* harmony import */ var _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/defaultConfig.js */ \"./src/utils/defaultConfig.js\");\n/* eslint-disable no-useless-constructor */\n\n\n\nlet { defaultFormat, defaultText } = _utils_defaultConfig_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\n\nclass Scatter extends _GeometryWithAxis_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (data, config) {\n    super(data, config);\n    this.colorScale = null;\n    this.init();\n  }\n\n  init () {\n    this.createContainer();\n    this.xScaleConfig();\n    this.yScaleConfig();\n    this.addCircleColorScale();\n  }\n\n  getDomain () {\n    return this.yScale.domain();\n  }\n\n  addCircleColorScale () {\n    let { feature } = this.config.sizeFeature;\n    if (!feature) {\n      return;\n    }\n    let min = 0;\n    let max = 0;\n    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);\n    min = sortData[0][feature];\n    max = sortData[sortData.length - 1][feature];\n    this.colorScale = d3.scaleLinear().domain([min, max]).range([10, 18]);\n  }\n\n  isExistCircle (\n    x,\n    y,\n    radius,\n    xKey,\n    yKey,\n    yTitleWidth,\n    yLabelWidth,\n    textWidth,\n    lineHeight\n  ) {\n    let match = this.data.find((i) => {\n      let minX =\n        this.xScale(i[xKey]) - radius - yTitleWidth - yLabelWidth - 6 - 2;\n      let minY = this.yScale(i[yKey]) - radius;\n      let maxY = this.yScale(i[yKey]) + radius;\n\n      if (\n        x <= minX &&\n        x + textWidth >= minX + radius * 2 &&\n        y >= minY &&\n        y <= maxY &&\n        y + lineHeight >= maxY\n      ) {\n        return i;\n      }\n      return null;\n    });\n    return !!match;\n  }\n\n  isExistInCoord (list, x, y, lineHeight) {\n    if (list.length === 0) {\n      return false;\n    }\n    let match = list.find((i) => {\n      let { x: minX, y: minY, textWidth } = i;\n      // console.log(minX, minY, textWidth);\n      if (\n        Math.abs(minX - x) < textWidth &&\n        Math.abs(minY - y) < lineHeight / 2\n      ) {\n        return i;\n      }\n\n      return null;\n    });\n    return !!match;\n  }\n\n  labelsConfig () {\n    this.geometry.selectAll('.scatter-labels').remove();\n    let yTitleWidth = this.yTitleWidth;\n    let yLabelWidth = this.yLabelWidth;\n\n    let labelHeight = this.labelHeight;\n    let titleHeight = this.titleHeight;\n    let list = this.config.labelsList;\n    if (list.length === 0) {\n      return;\n    }\n    let {\n      xAxis: { key: xKey = '' },\n      yAxis: { key: yKey = '' },\n      sizeFeature\n    } = this.config;\n    let coordList = [];\n    this.geometry\n      .selectAll('text')\n      .data((d) => {\n        let notShowCount = 0;\n        let tempList = list\n          .map((l, idx) => {\n            let { format = defaultFormat, text = defaultText } = l;\n            let radius = 16;\n            if (this.colorScale) {\n              radius = this.colorScale(d[sizeFeature.feature]);\n            }\n            let formatVal = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"dataProcess\"])(d[l.key], format);\n            let labelX = this.xScale(d[xKey]) - yTitleWidth - yLabelWidth + 8; // +radius\n\n            let labelY =\n              this.yScale(d[yKey]) + (idx - notShowCount) * text.lineHeight;\n\n            let textWidth = Object(_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__[\"getTextWidth\"])(formatVal, text.fontSize + 'px');\n            if (\n              this.isExistInCoord(coordList, labelX, labelY, text.lineHeight)\n            ) {\n              notShowCount++;\n              return null;\n            }\n            coordList.push({\n              x: labelX,\n              y: labelY,\n              textWidth\n            });\n            if (\n              !this.isExistCircle(\n                labelX,\n                labelY,\n                radius,\n                xKey,\n                yKey,\n                yTitleWidth,\n                yLabelWidth,\n                textWidth,\n                text.lineHeight\n              )\n            ) {\n              return {\n                ...d,\n                key: l.key,\n                title: l.title,\n                format: format,\n                text: text,\n                formatVal,\n                labelX,\n                labelY,\n                textWidth\n              };\n            } else {\n              notShowCount++;\n            }\n            return null;\n          })\n          .filter((f) => {\n            if (!f) {\n              return false;\n            }\n            if (\n              f.labelX + f.textWidth >\n              this.config.width - yTitleWidth - yLabelWidth - 6 - 2\n            ) {\n              return false;\n            }\n            return true;\n          });\n\n        let totalHeight = tempList.reduce((a, b) => {\n          return a + b.text.lineHeight;\n        }, this.yScale(d[yKey]));\n        let len =\n          (this.config.height -\n            labelHeight -\n            titleHeight -\n            this.yScale(d[yKey])) /\n          defaultText.lineHeight;\n\n        if (totalHeight >= this.config.height - labelHeight - titleHeight) {\n          tempList = tempList.slice(0, len);\n        }\n        return tempList;\n      })\n      .enter()\n      .append('text')\n      .attr('class', 'scatter-labels')\n      .attr('transform', (d) => `translate(${d.labelX},${d.labelY})`)\n      .attr('fill', (d) => d.text.fontColor)\n      .attr('font-size', (d) => d.text.fontSize)\n      .text((d) => d.formatVal);\n  }\n\n  draw () {\n    let {\n      xAxis: { key: xKey = '' },\n      yAxis: { key: yKey = '' },\n      colorFeature,\n      sizeFeature\n    } = this.config;\n    this.className = 'scatter-circle-item';\n    let { yTitleWidth, yLabelWidth } = this;\n    this.geometry = this.svg\n      .append('g')\n      .attr('class', 'scatter-circle-bundle')\n      .attr('transform', `translate(${yTitleWidth + yLabelWidth},${0})`)\n      .selectAll('g')\n      .data(this.data)\n      .enter()\n      .append('g')\n      .attr('class', 'scatter-circle-item');\n    let colorList = [];\n    this.geometry\n      .append('circle')\n      .attr('cx', (d) => {\n        return this.xScale(d[xKey]) - yTitleWidth - yLabelWidth - 6 - 2;\n      })\n      .attr('cy', (d) => {\n        return this.yScale(d[yKey]);\n      })\n      .attr('r', (d) => {\n        if (this.colorScale) {\n          return this.colorScale(d[sizeFeature.feature]);\n        }\n        return 16;\n      })\n      .attr('fill', (d, idx) => {\n        let feature = colorFeature ? colorFeature.feature : undefined;\n        let match = null;\n        let curIdx = idx;\n        if (feature && colorFeature.type === 'ordinal') {\n          colorList = colorList.map((i) => {\n            if (i.val === d[feature]) {\n              i.count++;\n              match = i;\n            }\n            return i;\n          });\n          curIdx = colorList.length;\n        }\n\n        if (match) {\n          return match.color;\n        }\n\n        let color = this.getItemColor(curIdx, feature && d[feature]);\n\n        colorList.push({\n          val: d[feature],\n          color,\n          index: 1\n        });\n\n        return color;\n      });\n    this.colorList = colorList;\n  }\n\n  // /**\n  //  * 画图形\n  //  */\n  // render () {\n  //   this.draw();\n  //   this.tooltipConfig();\n  //   this.registerEvent('click');\n  // }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Scatter);\n\n\n//# sourceURL=webpack://chart/./src/geometry/Scatter.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: GeometryDrawingProcess, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GeometryDrawingProcess\", function() { return GeometryDrawingProcess; });\n/* harmony import */ var _geometry_Bubble_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./geometry/Bubble.js */ \"./src/geometry/Bubble.js\");\n/* harmony import */ var _geometry_Scatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geometry/Scatter.js */ \"./src/geometry/Scatter.js\");\n/* harmony import */ var _chart_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chart/map.js */ \"./src/chart/map.js\");\n/* harmony import */ var _chart_bar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chart/bar.js */ \"./src/chart/bar.js\");\n/* harmony import */ var _chart_line_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chart/line.js */ \"./src/chart/line.js\");\n/* harmony import */ var _chart_barLine_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chart/barLine.js */ \"./src/chart/barLine.js\");\n/* harmony import */ var _chart_barRotated_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chart/barRotated.js */ \"./src/chart/barRotated.js\");\n/* harmony import */ var _chart_table_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chart/table.js */ \"./src/chart/table.js\");\n\n\n\n\n\n\n\n\n\nlet drawClasses = {\n  bubble: _geometry_Bubble_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  scatter: _geometry_Scatter_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  map: _chart_map_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n  bar: _chart_bar_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n  line: _chart_line_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n  barLine: _chart_barLine_js__WEBPACK_IMPORTED_MODULE_5__[\"default\"],\n  barRotated: _chart_barRotated_js__WEBPACK_IMPORTED_MODULE_6__[\"default\"],\n  table: _chart_table_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"]\n};\n\nlet GeometryDrawingProcess = function ({ config, data, chartType }) {\n  let instance = new drawClasses[chartType](data, config);\n  return {\n    draw: () => {\n      instance.render();\n    },\n    update: (type, data) => {\n      instance.update(type, data);\n    },\n    getColorList: () => {\n      return instance.getColorList();\n    },\n    getDomain: () => {\n      return instance.getDomain();\n    }\n  };\n};\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (GeometryDrawingProcess);\n\n\n//# sourceURL=webpack://chart/./src/index.js?");

/***/ }),

/***/ "./src/shape/axis.js":
/*!***************************!*\
  !*** ./src/shape/axis.js ***!
  \***************************/
/*! exports provided: setAxisLine, setAxisYTitle, setAxisLabel, setAxisY, initYAxis, initXAxis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisLine\", function() { return setAxisLine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisYTitle\", function() { return setAxisYTitle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisLabel\", function() { return setAxisLabel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAxisY\", function() { return setAxisY; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxis\", function() { return initYAxis; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initXAxis\", function() { return initXAxis; });\n/* harmony import */ var _tip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tip */ \"./src/shape/tip.js\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\n\n// 初始化X轴\nconst initXAxis = (middle, scaleX, width, height, option, topAxisHeight, labelHeight, xAxisList) => {\n  let position = option.position;\n  let axis = getAxis(scaleX, position);\n  let axisPanel = setAxisX(middle, axis, height, position, topAxisHeight);\n  setAxisLine(axisPanel, option.line.style);\n  setAxisLabel(axisPanel, option.label, scaleX.bandwidth(), _tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"], position);\n  setAxisXtitle(axisPanel, option.title, width, labelHeight);\n};\n\nconst setAxisX = (axisPanel, axis, height, position, topAxisHeight) => {\n  const posObj = {\n    bottom: height + topAxisHeight,\n    top: topAxisHeight\n  };\n  let axisX = axisPanel.append('g')\n    .attr('transform', () => {\n      return `translate(${0},${posObj[position]})`;\n    });\n  axisX.call(axis);\n  return axisX;\n};\n\nconst initYAxis = (axisYContainer, scaleY, option, tipTpl, height, topAxisHeight, width, index, isLast) => {\n  let position = option.position;\n  let axis = getAxis(scaleY, position);\n  let axisPanel = setAxisY(axisYContainer, axis, position, topAxisHeight, width, index, height);\n  setAxisLine(axisPanel, option.line.style);\n  setAxisYTitle(axisYContainer, option.title, position, width, topAxisHeight, height, index);\n  setAxisLabel(axisPanel, option.label, width, tipTpl, position, index, isLast);\n};\n\nconst setAxisY = (axisPanel, axis, position, topAxisHeight, translateX, index, height) => {\n  let scalePanel = axisPanel.append('g');\n  scalePanel.attr('transform', () => {\n    if (position === 'right') {\n      translateX = 1;\n    }\n    return `translate(${translateX - 1},${topAxisHeight + (height * index)})`;\n  })\n    .call(axis);\n  return scalePanel;\n};\n\nconst setTickValues = (domain, counts) => {\n  let tickArray = [];\n  let gap = Math.floor((domain[1] - domain[0]) / counts);\n  for (let i = 0; i <= counts; i++) {\n    tickArray.push(domain[0] + gap * i);\n  }\n  return tickArray;\n};\n\nconst getAxis = (scale, position) => {\n  const scaleObj = {\n    top: d3.axisTop(scale),\n    bottom: d3.axisBottom(scale),\n    left: d3.axisLeft(scale),\n    right: d3.axisRight(scale)\n  };\n  let axis = scaleObj[position]\n    .tickPadding(6)\n    .tickSizeInner(0)\n    .tickSizeOuter(0);\n  if (position === 'left' || position === 'right') {\n    let arr = setTickValues(scale.domain(), 5);\n    axis.tickValues(arr);\n  }\n  return axis;\n};\n\nconst setAxisLine = (scalePanel, option) => {\n  scalePanel.select('path')\n    .attr('stroke-dasharray', option.lineDash.join(',')) // 虚实线\n    .attr('stroke', option.fontColor) // 坐标轴线颜色\n    .attr('stroke-width', option.lineWidth) // 坐标轴线宽度\n    .attr('opacity', option.opacity); // 坐标轴线透明度\n};\n\nconst setAxisYTitle = (axisPanel, titleOption, position, width, topAxisHeight, height, index) => {\n  let titleStyle = titleOption.style;\n  axisPanel.append('g')\n    .attr('transform', () => {\n      let translateX = width - 60;\n      if (position === 'right') {\n        translateX = width - 16;\n      }\n      return `translate(${translateX}, ${topAxisHeight + (height * index) + 4})`;\n    })\n    .append('text')\n    .attr('text-anchor', 'start')\n    .attr('fill', titleStyle.fontColor) // 标题颜色\n    .attr('font-size', titleStyle.fontSize) // 标题大小\n    .text(titleOption.value) // 标题名称\n    .attr('title', titleOption.value)\n    .style('writing-mode', 'tb');\n};\n\nconst setAxisXtitle = (axisPanel, option, width, labelHeight) => {\n  let titleStyle = option.style;\n  axisPanel.append('g')\n    .append('text')\n    .attr('text-anchor', 'end')\n    .attr('transform', `translate(${width},${labelHeight || 40})`)\n    .attr('fill', titleStyle.fontColor)\n    .attr('font-size', titleStyle.fontSize)\n    .text(option.value)\n    .attr('title', option.value);\n};\n\nconst setAxisLabel = (scalePanel, option, width, textTip, position, yIndex, isLast) => {\n  let labelStyle = option.style;\n  let rotate = option.rotate;\n  let allText = scalePanel.selectAll('text');\n  let txtNum = allText._groups[0].length - 1;\n  let fullLen = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtLen\"])(width, labelStyle.fontSize);\n  allText.attr('font-size', labelStyle.fontSize) // 标签文本大小\n    .attr('fill', labelStyle.fontColor) // 标签文本颜色\n    .attr('opacity', labelStyle.opacity) // 标签文本透明度\n    .attr('text-anchor', () => {\n      if (position === 'bottom') {\n        let obj = {\n          90: 'end',\n          0: 'middle',\n          45: 'end',\n          '-45': 'start'\n        };\n        return obj[rotate];\n      }\n    })\n    .text((d, index) => {\n      if (position === 'bottom') {\n        let txt = d.split('|~|')[0];\n        let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(txt, labelStyle.fontSize);\n        if (len < width) {\n          return txt;\n        } else {\n          return rotate !== 90 ? txt.slice(0, fullLen) + '...' : txt;\n        }\n      }\n      return yIndex !== 0 && txtNum === index ? '' : d;\n    })\n    .on('mouseenter', (d) => {\n      let txt = d.split('|~|')[0];\n      let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(txt, labelStyle.fontSize);\n      if (len > width) {\n        Object(_tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"])(txt, true, textTip);\n      }\n    })\n    .on('mouseout', () => {\n      Object(_tip__WEBPACK_IMPORTED_MODULE_0__[\"tipTpl\"])('', false, textTip);\n    });\n  if (position === 'bottom') {\n    allText.attr('transform', (d) => {\n      let len = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_1__[\"getTxtWidth\"])(d, labelStyle.fontSize) + 4;\n      const transfromObj = {\n        45: `translate(0, ${len}) rotate(45)`,\n        '-45': `translate(0, ${len}) rotate(-45)`,\n        90: `translate(0, ${len}) rotate(90)`,\n        0: 'translate(0, 5)'\n      };\n      return transfromObj[rotate];\n    });\n  } else {\n    if (rotate === 90) {\n      let offsetY = position === 'left' ? -28 : -28;\n      let offsetX = position === 'left' ? 8 : -8;\n      allText.attr('x', offsetX)\n        .attr('y', offsetY);\n    }\n    allText.attr('text-anchor', position === 'right' ? 'start' : '');\n    allText.attr('transform', `rotate(${rotate})`);\n  }\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/axis.js?");

/***/ }),

/***/ "./src/shape/grid.js":
/*!***************************!*\
  !*** ./src/shape/grid.js ***!
  \***************************/
/*! exports provided: initYGrid, initXGrid, initYAxisGrid, initMiddleGrid, initYAxisLine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYGrid\", function() { return initYGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initXGrid\", function() { return initXGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxisGrid\", function() { return initYAxisGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initMiddleGrid\", function() { return initMiddleGrid; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initYAxisLine\", function() { return initYAxisLine; });\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\nconst initYGrid = (middle, width, height, scaleY, topAxisHeight, index) => {\n  let axis = d3.axisLeft(scaleY)\n    .tickPadding(6)\n    .ticks(5)\n    .tickSizeInner(-(width))\n    .tickSizeOuter(0);\n  let grid = middle.append('g')\n    .attr('height', height)\n    .attr('width', width)\n    .append('g')\n    .attr('transform', `translate(${0},${topAxisHeight + (index * height)})`)\n    .call(axis);\n  grid.select('path').attr('opacity', 0);\n  grid.selectAll('text')\n    .attr('opacity', 0)\n    .text((d) => {\n      return '';\n    });\n  grid.selectAll('line')\n    .attr('stroke-dasharray', '5, 5')\n    .attr('stroke', '#c2c9d1')\n    .attr('opacity', 0)\n    .attr('stroke-width', 1);\n};\n\nconst setUniqueForKey = (perKey, key, data) => {\n  let len = data.length;\n  let arr = [];\n  let uniqueValue = '';\n  for (let i = 0; i < len; i++) {\n    if (uniqueValue !== data[i][perKey]) {\n      arr.push(data[i][key]);\n      uniqueValue = data[i][perKey];\n    } else {\n      if (!arr.includes(data[i][key])) {\n        arr.push(data[i][key]);\n      }\n    }\n  }\n  return arr;\n};\n\nconst initXGrid = (middle, width, height, topAxis, bandwidth, xAxisList, data, title, perKey, perList, key) => {\n  let grid = middle.append('g')\n    .attr('transform', `translate(${0}, ${topAxis})`);\n  let uniqueData = [];\n  if (!perKey) {\n    uniqueData = [...new Set(xAxisList)];\n  } else {\n    uniqueData = setUniqueForKey(perKey, key, data);\n  }\n  let lineLen = uniqueData.length - 1;\n  let textGroup = grid.append('g').attr('class', 'top-axis-text');\n  // 添加title\n  textGroup.append('g').append('text')\n    .text(title)\n    .attr('font-size', 14)\n    .attr('transform', (d) => {\n      let translateX = (width - Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"getTxtWidth\"])(title, 14)) / 2;\n      return `translate(${translateX}, -32)`;\n    });\n  // 添加文本\n  let perValue = '';\n  let perIndex = '';\n  let xGridGroup = textGroup.selectAll('top-axis-text')\n    .data(uniqueData)\n    .enter();\n  xGridGroup.append('text')\n    .attr('transform', (d, index) => {\n      let num = xAxisList.filter(item => item === d).length;\n      let start = xAxisList.indexOf(d);\n      let gap = bandwidth * num;\n      let startGap = bandwidth * start;\n      let txtGap = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"getTxtWidth\"])(d, 14) / 2;\n      let translateX = startGap + gap / 2 - txtGap;\n      if (perKey) {\n        if (perValue === d) {\n          perIndex++;\n        } else {\n          perValue = d;\n          perIndex = 1;\n        }\n        let total = uniqueData.filter(item => item === d).length;\n        gap = gap / total;\n        translateX = startGap + gap / 2 + gap * (perIndex - 1) - txtGap;\n      }\n      return `translate(${translateX}, ${-12}) rotate(${0})`;\n    })\n    .attr('font-size', 14)\n    .text(d => d);\n  // 添加线\n  xGridGroup.append('line')\n    .attr('x1', (d) => {\n      let num = xAxisList.filter(item => item === d).length;\n      let start = xAxisList.indexOf(d);\n      let width = (num + start) * bandwidth;\n      return width;\n    })\n    .attr('y1', -30)\n    .attr('x2', (d) => {\n      let num = xAxisList.filter(item => item === d).length;\n      let start = xAxisList.indexOf(d);\n      let width = (num + start) * bandwidth;\n      return width;\n    })\n    .attr('y2', height)\n    .attr('opacity', (d, index) => {\n      return lineLen === index ? 0 : 1;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initYAxisGrid = (leftAxis, yAxisHeight, uniqueData, width, xIndex, topAxisHeight, perKey, key, data, i) => {\n  let grid = leftAxis.append('g')\n    .attr('transform', `translate(${0}, ${topAxisHeight})`);\n  let lineGroup = grid.append('g').attr('class', 'top-axis-line');\n  let yGridGroup = lineGroup.selectAll('top-axis-line')\n    .data(uniqueData)\n    .enter();\n  // let lineLen = uniqueData.length - 1;\n  let perNum = 0;\n  yGridGroup.append('text')\n    .attr('transform', (d, index) => {\n      let x = xIndex * 45 + 30;\n      let isUnit = i === 0;\n      let height = (index + 1) * yAxisHeight - yAxisHeight / 2;\n      if (!isUnit) {\n        let perIndex = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setPartHeight\"])(d, data, perKey, key);\n        height = (perNum + perIndex / 2) * yAxisHeight;\n        perNum = perNum + perIndex;\n      }\n      return `translate(${x}, ${height})`;\n    })\n    .attr('font-size', 14)\n    .attr('text-anchor', 'middle')\n    .style('writing-mode', 'tb')\n    .text(d => d);\n\n  // 画多Y轴横线\n  let lineStartNum = 0;\n  let lineEndNum = 0;\n  let lienLen = uniqueData.length - 1;\n  yGridGroup.append('line')\n    .attr('x1', (d, index) => {\n      return 50 * xIndex;\n    })\n    .attr('y1', (d, index) => {\n      let perIndex = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setPartHeight\"])(d, data, perKey, key);\n      let height = (lineStartNum + perIndex) * yAxisHeight;\n      lineStartNum = lineStartNum + perIndex;\n      return height;\n    })\n    .attr('x2', width)\n    .attr('y2', (d, index) => {\n      let perIndex = Object(_utils_utils__WEBPACK_IMPORTED_MODULE_0__[\"setPartHeight\"])(d, data, perKey, key);\n      let height = (lineEndNum + perIndex) * yAxisHeight;\n      lineEndNum = lineEndNum + perIndex;\n      return height;\n    })\n    .attr('opacity', (d, index) => {\n      let opacity = lienLen === index ? 0 : 1;\n      return opacity;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initYAxisLine = (leftAxis, topAxisHeight, height, xIndex) => {\n  let grid = leftAxis.append('g').attr('class', 'line');\n  grid.append('line')\n    .attr('x1', xIndex * 50)\n    .attr('y1', topAxisHeight)\n    .attr('x2', xIndex * 50)\n    .attr('y2', topAxisHeight + height)\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\nconst initMiddleGrid = (middle, yAxisHeight, uniqueData, width, topAxisHeight) => {\n  let grid = middle.append('g')\n    .attr('transform', `translate(${0}, ${topAxisHeight + yAxisHeight})`);\n  let lineGroup = grid.append('g').attr('class', 'top-axis-line');\n  let yGridGroup = lineGroup.selectAll('top-axis-line')\n    .data(uniqueData)\n    .enter();\n  let lineLen = uniqueData.length - 1;\n  yGridGroup.append('line')\n    .attr('x1', 0)\n    .attr('y1', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('x2', width)\n    .attr('y2', (d, index) => {\n      return index * yAxisHeight;\n    })\n    .attr('opacity', (d, index) => {\n      return index === lineLen ? 0 : 1;\n    })\n    .attr('stroke-width', 1)\n    .attr('stroke', '#c2c9d1');\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/grid.js?");

/***/ }),

/***/ "./src/shape/scale.js":
/*!****************************!*\
  !*** ./src/shape/scale.js ***!
  \****************************/
/*! exports provided: scaleLinear, scaleBand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scaleLinear\", function() { return scaleLinear; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scaleBand\", function() { return scaleBand; });\nconst scaleLinear = (maxValue, height) => {\n  let scale = d3.scaleLinear()\n    .domain([0, maxValue * 1.1])\n    .range([height, 0])\n    .nice();\n  return scale;\n};\n\nconst scaleBand = (data, barWidth, unique) => {\n  let scale = d3.scaleBand();\n  if (unique) {\n    scale.domain(data);\n  } else {\n    scale.domain(data.map((d, index) => {\n      return `${d}|~|${index}`;\n    }));\n  }\n  scale.range([0, barWidth]);\n  return scale;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/shape/scale.js?");

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
/*! exports provided: isArray, isEmpty, isNumber, isObject, isObjectType, isString, isUndefined, notEmpty, hasKey, getTextWidth, isDefined, isMobile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isArray\", function() { return isArray; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isEmpty\", function() { return isEmpty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isNumber\", function() { return isNumber; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isObject\", function() { return isObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isObjectType\", function() { return isObjectType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isString\", function() { return isString; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isUndefined\", function() { return isUndefined; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"notEmpty\", function() { return notEmpty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hasKey\", function() { return hasKey; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextWidth\", function() { return getTextWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isDefined\", function() { return isDefined; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isMobile\", function() { return isMobile; });\nconst isString = v => typeof v === 'string';\nconst isNumber = v => typeof v === 'number';\nconst isUndefined = v => typeof v === 'undefined';\nconst isObjectType = v => typeof v === 'object';\nconst isEmpty = o => (\n  isUndefined(o) || o === null ||\n    (isString(o) && o.length === 0) ||\n    (isObjectType(o) && Object.keys(o).length === 0)\n);\nconst notEmpty = o => !isEmpty(o);\n\nconst isArray = arr => arr && arr.constructor === Array;\n\nconst isObject = obj => obj && !obj.nodeType && isObjectType(obj) && !isArray(obj);\n\nconst hasKey = (dict, key) => {\n  let found = false;\n  Object.keys(dict).includes(key) && (found = true);\n  return found;\n};\n\n// 字符宽度\nlet getTextWidth = function (text, font) {\n  // re-use canvas object for better performance\n  var canvas = document.createElement('canvas');\n  var context = canvas.getContext('2d');\n  context.font = font;\n  var metrics = context.measureText(text);\n  return metrics.width;\n};\nconst isDefined = v => typeof v !== 'undefined';\n\nlet isMobile = function () {\n  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {\n    return true;\n  } else {\n    return false;\n  }\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/check.js?");

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

/***/ "./src/utils/data.js":
/*!***************************!*\
  !*** ./src/utils/data.js ***!
  \***************************/
/*! exports provided: getMaxValue, getKeyDataList, getKeyValueDataList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMaxValue\", function() { return getMaxValue; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getKeyDataList\", function() { return getKeyDataList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getKeyValueDataList\", function() { return getKeyValueDataList; });\nconst getMaxValue = (data, keyList) => {\n  let mergeList = [];\n  for (let i = 0, len = keyList.length; i < len; i++) {\n    for (let j = 0, len = data.length; j < len; j++) {\n      mergeList.push(data[j][keyList[i]]);\n    }\n  }\n  return Math.max(...mergeList);\n};\n\nconst getKeyDataList = (data, key) => {\n  let list = [];\n  for (let i = 0, len = data.length; i < len; i++) {\n    list.push(data[i][key]);\n  }\n  return list;\n};\n\nconst getKeyValueDataList = (data, key, value) => {\n  let list = [];\n  for (let i = 0, len = data.length; i < len; i++) {\n    if (data[i][key] === value) {\n      list.push(data[i]);\n    }\n  }\n  return list;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/data.js?");

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
/*! exports provided: getTextLegend, dataProcess, styleProcess, toScientificNotation, getTextWidth, fontSizeLineHeightPair, setTextPos, setLinePos, getTxtLen, getTxtWidth, getTopAxisHeight, setAsideWidth, setBottomLabelHeight, setUnitHeight, setPartHeight, getMaxValueWidth */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextLegend\", function() { return getTextLegend; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dataProcess\", function() { return dataProcess; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"styleProcess\", function() { return styleProcess; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toScientificNotation\", function() { return toScientificNotation; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTextWidth\", function() { return getTextWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fontSizeLineHeightPair\", function() { return fontSizeLineHeightPair; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setTextPos\", function() { return setTextPos; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setLinePos\", function() { return setLinePos; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTxtLen\", function() { return getTxtLen; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTxtWidth\", function() { return getTxtWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getTopAxisHeight\", function() { return getTopAxisHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAsideWidth\", function() { return setAsideWidth; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setBottomLabelHeight\", function() { return setBottomLabelHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setUnitHeight\", function() { return setUnitHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setPartHeight\", function() { return setPartHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMaxValueWidth\", function() { return getMaxValueWidth; });\n/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ \"./src/utils/data.js\");\n\nconst getTextLegend = (text, fontSize) => {\n  let textLen = String(text).length;\n  return (textLen * fontSize) / 2 + fontSize;\n};\n\nlet dataProcess = function (val, format) {\n  if (!val) {\n    return;\n  }\n  let ret = val;\n  if (format.decimal) {\n    if (format.isPercent) {\n      ret = ret * 100;\n    }\n    ret = ret.toFixed(format.decimal);\n    if (format.isPercent) {\n      ret = ret + '%';\n    }\n  }\n\n  ret = unitProcess(ret, format.unit);\n\n  ret = displayFormatProcess(ret, format.format, format.zone);\n  ret = prefSuffixProcess(ret, format.prefix, format.suffix, format.isPercent);\n  return ret;\n};\n\nlet unitProcess = function (val, unit, micrometerFlag) {\n  let unitPare = {\n    'K 千': 1000,\n    'M 百万': 1000000,\n    'G 十亿': 1000000000,\n    'T 千亿': 100000000000\n  };\n  if (!unit) {\n    return val;\n  }\n  let ret = val / unitPare[unit];\n  return micrometerProcess(ret, micrometerFlag) + unit;\n};\n\nlet displayFormatProcess = function (val, format, zone) {\n  if (!format) {\n    return val;\n  }\n  if (format === 'percent') {\n    return val * 100 + '%';\n  }\n  let formatPare = {\n    CN: '￥',\n    JP: '¥',\n    HK: 'HK$',\n    US: '＄',\n    EUR: '€',\n    GBP: '£'\n  };\n  return formatPare[zone] + val;\n};\n\nlet prefSuffixProcess = function (val, prefix, suffix, isPercent) {\n  if (prefix) {\n    val = prefix + val;\n  }\n  if (suffix && !isPercent) {\n    val = val + suffix;\n  }\n  return val;\n};\n\nlet micrometerProcess = function (val, flag) {\n  if (!flag || val < 1000) {\n    return val;\n  }\n  let ret = '';\n  for (let i = 0; i < val.length; i++) {\n    ret += val[i];\n    if (i % 3 === 2) {\n      ret += ',';\n    }\n  }\n  return parseFloat(ret);\n};\n\nlet styleProcess = function (styleObj) {\n  return ` textAlign: ${styleObj.align};\n  color:  ${styleObj.fontColor};\n  fontSize:  ${styleObj.fontSize + 'px'};\n  fontStyle:  ${styleObj.fontStyle};\n  lineHeight:  ${styleObj.lineHeight + 'px'};\n  letterSpacing:  ${styleObj.letterSpacing + 'px'}`;\n};\n\nlet toScientificNotation = function (val) {\n  if (!val) {\n    return;\n  }\n  let ret = val.toString();\n  if (ret.length <= 4) {\n    return ret;\n  } else if (ret.length <= 6) {\n    return (ret / 1000).toFixed(2) + 'k';\n  } else if (ret.length <= 9) {\n    return (ret / 1000000).toFixed(2) + 'm';\n  } else {\n    return (ret / 1000000000).toFixed(2) + 'g';\n  }\n};\n\nlet getTextWidth = function (str, font) {\n  let canvas = document.createElement('canvas');\n  var context = canvas.getContext('2d');\n  context.font = font || '12px sans-serif';\n  let { width } = context.measureText(str);\n  return width;\n};\n\nlet fontSizeLineHeightPair = {\n  8: 12,\n  9: 12,\n  10: 12,\n  12: 18,\n  14: 20,\n  16: 24,\n  18: 26,\n  20: 30,\n  24: 34,\n  28: 36,\n  30: 40,\n  32: 44,\n  36: 54,\n  40: 56,\n  48: 60,\n  56: 64,\n  64: 72,\n  72: 88\n};\n\nconst hasValue = (arr, key, value) => {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i][key] === value) {\n      return true;\n    }\n  }\n  return false;\n};\n\nconst uniqueKeyArr = (key, list) => {\n  let arr = [];\n  for (let i = 0, len = list.length; i < len; i++) {\n    if (!hasValue(arr, key, list[i][key])) {\n      arr.push(list[i]);\n    }\n  }\n  return arr;\n};\n\nconst setUnitHeight = (height, text, data, axisKey, isUnit, index) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0, len = arr.length; i < len; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  console.log(start);\n  return num * height * index - (getTxtWidth(text, 14) / 2);\n  // return isUnit ? num * height * index : (height * start) + (num * height - getTxtWidth(text, 14)) / 2;\n};\n\nconst setPartHeight = (d, data, perKey, key) => {\n  let arr = data.filter(item => item[key[0]] === d);\n  let len = arr.length;\n  let perArr = [];\n  for (let i = 0; i < len; i++) {\n    perArr.push(arr[i][perKey[0]]);\n  }\n  perArr = [...new Set(perArr)];\n  return perArr.length;\n};\n\nconst setTextPos = (width, text, data, axisKey) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0; i < arr.length; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  return (width * start) + ((width * num - getTxtWidth(text, 14)) / 2);\n};\n\nconst setLinePos = (width, text, data, axisKey) => {\n  let num = 0;\n  let start = 0;\n  let arr = uniqueKeyArr(axisKey, data);\n  for (let i = 0; i < arr.length; i++) {\n    for (let key in arr[i]) {\n      if (arr[i][key] === text) {\n        if (num === 0) {\n          start = i;\n        }\n        num++;\n      }\n    }\n  }\n  return (width * start) + (width * num);\n};\n\nconst getTxtLen = (width, font) => {\n  let textDom = document.createElement('div');\n  textDom.style.width = width + 'px';\n  textDom.style.fontSize = font + 'px';\n  textDom.style.overflowX = 'auto';\n  textDom.style.whiteSpace = 'nowrap';\n  let txt = '';\n  for (let i = 0; i < width; i++) {\n    txt = txt + '哈';\n    textDom.innerText = txt;\n    document.body.appendChild(textDom);\n    if (textDom.scrollWidth >= width) {\n      document.body.removeChild(textDom);\n      return { limit: i, space: 1 };\n    };\n    document.body.removeChild(textDom);\n  }\n\n  return -1;\n};\n\nconst getTxtWidth = (text, font) => {\n  let textDom = document.createElement('span');\n  textDom.innerText = text;\n  textDom.style.fontSize = font + 'px';\n  textDom.style.position = 'fixed';\n  document.body.appendChild(textDom);\n  let width = textDom.clientWidth;\n  document.body.removeChild(textDom);\n  return width;\n};\n\nconst getTxtHeight = (text, font) => {\n  let textDom = document.createElement('span');\n  textDom.innerText = text;\n  textDom.style.fontSize = font + 'px';\n  textDom.style.position = 'fixed';\n  document.body.appendChild(textDom);\n  let height = textDom.clientHeight;\n  document.body.removeChild(textDom);\n  return height;\n};\n\nconst getTopAxisHeight = (xAxisPart) => {\n  if (!xAxisPart || xAxisPart.length === 0) return 16;\n  else return (xAxisPart.length) * 32 + 16;\n};\n\nconst setAsideWidth = (yAxis, maxValue, yAxisPart) => {\n  if (!yAxis) return 16;\n  let txtLen = getTxtWidth(String(Math.floor(maxValue)), 14) + 20;\n  let titleLen = getTxtWidth('哈', 16);\n  if (!yAxisPart) return txtLen + titleLen;\n  return yAxisPart.length * 50 + txtLen + titleLen;\n};\n\nconst setBottomLabelHeight = (xAxis, xData) => {\n  let label = xAxis.label;\n  let longest = xData.reduce((a, b) => String(a).length > String(b).length ? a : b);\n  let height = getTxtHeight(String(longest), label.style.fontSize);\n  let width = getTxtWidth(String(longest), label.style.fontSize);\n  let rotate = label.rotate;\n  if (rotate !== 0) {\n    return width;\n  }\n  return height;\n};\n\nconst getMaxValueWidth = (yAxis, data, yAxisPart, position) => {\n  let leftMaxValueArr = [];\n  let leftMaxWidthArr = [];\n  for (let i = 0; i < yAxis.length; i++) {\n    let leftAxisList = yAxis[i].filter(item => item.position === position);\n    if (leftAxisList.length) {\n      let leftMaxValue = Object(_data__WEBPACK_IMPORTED_MODULE_0__[\"getMaxValue\"])(data[i], leftAxisList[0].key);\n      let leftAxisWidth = setAsideWidth(leftAxisList[0], Math.floor(leftMaxValue), yAxisPart);\n      leftMaxValueArr.push(leftMaxValue);\n      leftMaxWidthArr.push(leftAxisWidth);\n    }\n  };\n  let obj = {};\n  obj[`${position}MaxValue`] = Math.max(...leftMaxValueArr);\n  obj[`${position}AxisWidth`] = Math.max(...leftMaxWidthArr);\n  return obj;\n};\n\n\n\n\n//# sourceURL=webpack://chart/./src/utils/utils.js?");

/***/ })

/******/ });
});