const chai = require('chai');
const expect = chai.expect;
const randomstring = require('randomstring');

const validator = require('../../backend/lib/services/validator');

describe('Validator', () => {

  describe('validateQuery', () => {

    const $query = require('../../common/schema/query.json');

    describe('defaults', () => {
      let query = {};
      validator.validateQuery(query);

      it('można podesłać pusty objekt', () => {
        expect(validator.validateQuery.errors).to.be.null;
      });

      it('wypełnia domyślny limit', () => {
        expect(query.limit).to.be.eq($query.properties.limit.default);
      });

      it('wypełnia domyślny limit', () => {
        expect(query.offset).to.be.eq($query.properties.offset.default);
      });
    });

    describe('limit', () => {

      it('nie zgłasza błędu przy minimalnej wartości', () => {
        validator.validateQuery({
          limit: $query.properties.limit.minimum
        });
        expect(validator.validateQuery.errors).to.be.null;
      });

      it('zgłasza błąd przy za małej wartości', () => {
        validator.validateQuery({
          limit: $query.properties.limit.minimum - 1
        });
        expect(validator.validateQuery.errors).to.have.at.length(1);
        expect(validator.validateQuery.errors[0]).to.have.property('keyword', 'minimum');
      });

      it('nie zgłasza błędu przy maksymalnej wartości', () => {
        validator.validateQuery({
          limit: $query.properties.limit.maximum
        });
        expect(validator.validateQuery.errors).to.be.null;
      });

      it('zgłasza błąd przy za dużej wartości', () => {
        validator.validateQuery({
          limit: $query.properties.limit.maximum + 1
        });
        expect(validator.validateQuery.errors).to.have.at.length(1);
        expect(validator.validateQuery.errors[0]).to.have.property('keyword', 'maximum');
      });

    });

    describe('offset', () => {

      it('nie zgłasza błędu przy minimalnej wartości', () => {
        validator.validateQuery({
          offset: $query.properties.offset.minimum
        });
        expect(validator.validateQuery.errors).to.be.null;
      });

      it('nie zgłasza błędu przy wartości większej niż minimum', () => {
        validator.validateQuery({
          offset: $query.properties.offset.minimum + 1
        });
        expect(validator.validateQuery.errors).to.be.null;
      });

      it('zgłasza błąd przy za małej wartości', () => {
        validator.validateQuery({
          offset: $query.properties.offset.minimum - 1
        });
        expect(validator.validateQuery.errors).to.have.at.length(1);
        expect(validator.validateQuery.errors[0]).to.have.property('keyword', 'minimum');
      });

    });

    describe('additionalProperties', () => {

      it('zgłasza błąd przy dodatkowych własnościach', () => {
        validator.validateQuery({
          test: true
        });
        expect(validator.validateQuery.errors).to.have.at.length(1);
        expect(validator.validateQuery.errors[0]).to.have.property('keyword', 'additionalProperties');
      });

    });

  });

  describe('validateIntention', () => {

    const $intention = require('../../common/schema/intention.json');

    describe('content', () => {
      it('zgłasza błąd przy braku', () => {
        validator.validateIntention({
          content: undefined,
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'required');
      });

      it('nie zgłasza błędu przy minimalnej długości', () => {
        validator.validateIntention({
          content: randomstring.generate($intention.properties.content.minLength),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

      it('zgłasza błąd przy za małej długości', () => {
        validator.validateIntention({
          content: randomstring.generate($intention.properties.content.minLength - 1),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'minLength');
      });

      it('nie zgłasza błędu przy maksymalnej długości', () => {
        validator.validateIntention({
          content: randomstring.generate($intention.properties.content.maxLength),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

      it('zgłasza błąd przy za dużej długości', () => {
        validator.validateIntention({
          content: randomstring.generate($intention.properties.content.maxLength + 1),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'maxLength');
      });

      it('zgłasza błąd przy zakazanych', () => {
        validator.validateIntention({
          content: '<script>alert(1);</script>',
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'pattern');
      });

      it('nie zgłasza błędu użyciu emoji', () => {
        validator.validateIntention({
          content: 'O zdrowie dla babci 🙏',
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

    });

    describe('author', () => {
      it('nie zgłasza błędu przy braku', () => {
        validator.validateIntention({
          content: 'abcdefg',
          author: undefined,
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

      it('nie zgłasza błędu przy minimalnej długości', () => {
        validator.validateIntention({
          content: 'abcdefg',
          author: 'a',
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

      it('nie zgłasza błędu przy maksymalnej długości', () => {
        validator.validateIntention({
          content: 'abcdefg',
          author: randomstring.generate({
            length: $intention.properties.author.maxLength,
            charset: 'alphabetic'
          }),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.be.null;
      });

      it('zgłasza błąd przy za dużej długości', () => {
        validator.validateIntention({
          content: 'abcdefg',
          author: randomstring.generate({
            length: $intention.properties.author.maxLength + 1,
            charset: 'alphabetic'
          }),
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'maxLength');
      });

      it('zgłasza błąd przy zakazanych', () => {
        validator.validateIntention({
          content: 'abcdefg',
          author: '<i>alert(1);</i>',
          captcha: 0
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'pattern');
      });

    });


    describe('additionalProperties', () => {

      it('zgłasza błąd przy dodatkowych własnościach', () => {
        validator.validateIntention({
          test: true
        });
        expect(validator.validateIntention.errors).to.have.at.length(1);
        expect(validator.validateIntention.errors[0]).to.have.property('keyword', 'additionalProperties');
      });

    });

  });

});
