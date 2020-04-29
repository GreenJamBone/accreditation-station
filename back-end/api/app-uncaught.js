let reporter = function (type, ...rest)
{
	// remote reporter logic goes here
};

/* handle an uncaught exception & exit the process */
process.on('uncaughtException', function (err)
{
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);

	reporter("uncaughtException", (new Date).toUTCString(), err.message, err.stack);

	process.exit(1);
});

/* handle an unhandled promise rejection */
process.on('unhandledRejection', function (reason, promise)
{
	console.error('unhandled rejection:', reason.message || reason);

	reporter("uncaughtException", (new Date).toUTCString(), reason.message || reason);
})