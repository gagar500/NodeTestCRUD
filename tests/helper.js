const mongoose = require('mongoose');

before(done => {
	mongoose.connect('mongodb://127.0.0.1:27017/pkap_test', {useMongoClient: true});
	mongoose.connection
		.once('open', () => done())
		.on('error', error => {
			console.warn('Warning', error);
		});
});

beforeEach(done => {
	const { todolists,users} = mongoose.connection.collections;
	todolists.drop()
		.then(() => users.drop().then(() => done())
		.catch(() => done()))
		.catch(() => done());

});
