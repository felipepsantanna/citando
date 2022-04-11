import excuteQuery from '../../db/mysql';

export default class Frases {
    postID = null;

    now = this.getNow();
    gmt = this.getGmt();
    postFuture = this.getPostFuture();
    postFutureGmt = this.getPostFutureGmt();

    getNow() {
        const dateNow = new Date();
        dateNow.setMonth(dateNow.getMonth() + 1);

        return dateNow.getFullYear().toString() +
            '-' +
            dateNow.getMonth().toString().padStart(2, '0') +
            '-' +
            dateNow.getDate().toString().padStart(2, '0') +
            ' ' +
            dateNow.getHours().toString().padStart(2, '0') +
            ':' +
            dateNow.getMinutes().toString().padStart(2, '0') +
            ':' +
            dateNow.getSeconds().toString().padStart(2, '0');
    }

    getGmt() {

        const dateGmt = new Date();
        dateGmt.setMonth(dateGmt.getMonth() + 1);
        dateGmt.setHours(dateGmt.getHours() + 3);


        return dateGmt.getFullYear().toString() +
            '-' +
            dateGmt.getMonth().toString().padStart(2, '0') +
            '-' +
            dateGmt.getDate().toString().padStart(2, '0') +
            ' ' +
            dateGmt.getHours().toString().padStart(2, '0') +
            ':' +
            dateGmt.getMinutes().toString().padStart(2, '0') +
            ':' +
            dateGmt.getSeconds().toString().padStart(2, '0');
    }

    getPostFuture() {
        const dateNow = new Date();
        dateNow.setDate(dateNow.getDate() + 1);
        dateNow.setMonth(dateNow.getMonth() + 1);
        return dateNow.getFullYear().toString() +
            '-' +
            dateNow.getMonth().toString().padStart(2, '0') +
            '-' +
            dateNow.getDate().toString().padStart(2, '0') +
            ' ' +
            '08:01:00'
    }

    getPostFutureGmt() {

        const dateGmt = new Date();
        dateGmt.setDate(dateGmt.getDate() + 1);
        dateGmt.setMonth(dateGmt.getMonth() + 1);
        dateGmt.setHours(dateGmt.getHours() + 3);


        return dateGmt.getFullYear().toString() +
            '-' +
            dateGmt.getMonth().toString().padStart(2, '0') +
            '-' +
            dateGmt.getDate().toString().padStart(2, '0') +
            ' ' +
            '11:01:00'
    }

    getCurDate() {
        const dateNow = new Date();
        dateNow.setMonth(dateNow.getMonth() + 1);

        return dateNow.getFullYear().toString() +
            '-' +
            dateNow.getMonth().toString().padStart(2, '0') +
            '-' +
            dateNow.getDate().toString().padStart(2, '0');
    }

    async InsertPost(frase, url) {


        const result = await excuteQuery({
            query: `INSERT INTO wp_posts(ID,
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        comment_status,
        ping_status,
        post_password,
        post_name,
        to_ping,
        pinged,
        post_modified,
        post_modified_gmt,
        post_content_filtered,
        post_parent,
        guid,
        menu_order,
        post_type,
        post_mime_type,
        comment_count
        ) VALUES (

        NULL, -- ID
        '2', -- post_author
        '${this.now}', -- post_date
        '${this.gmt}', -- post_date_gmt
        '', -- post_content
        '${frase}', -- post_title
        '', -- post_excerpt
        'publish', -- post_status
        'open', -- comment_status
        'open', -- ping_status
        '', -- post_password
        '${url}', -- post_name
        '', -- to_ping
        '', -- pinged
        '${this.now}', -- post_modified
        '${this.gmt}', -- post_modified_gmt
        '', -- post_content_filtered
        '0', -- post_parent
        '', -- guid
        '0', -- menu_order
        'post', -- post_type
        '', -- post_mime_type
        '0' -- comment_count

        )`,
        });

        this.postID = result.insertId;
        return result;
    }

    async InsertCategory() {
        return "";
    }

    async InsertRelationship(postID, taxonomyID) {
        const resultWP_TERMS_RELATIONSHIP = await excuteQuery({
            query: `INSERT INTO wp_term_relationships(object_id,term_taxonomy_id,term_order) VALUES (${postID}, ${taxonomyID}, 0)`,
        });
        return resultWP_TERMS_RELATIONSHIP;
    }

    async InsertPostMetas(postID, meta_key, meta_value) {
        const resultWP_POSTMETA = await excuteQuery({
            query: `INSERT INTO wp_postmeta(meta_id,post_id,meta_key,meta_value) VALUES (NULL,${postID},'${meta_key}','${meta_value}')`,
        });
        return resultWP_POSTMETA;
    }

    async GetFrase(data) {
        const result = await excuteQuery({
            query: `SELECT * FROM frases_do_dia where data = CURRENT_DATE `
        });

        return result;
    }

    async CreateFraseDoDia() {
        const result = await excuteQuery({
            query: `insert into frases_do_dia
                    select 		m.post_id, m.meta_value, CURRENT_DATE 
                    from 		wp_postmeta m
                    WHERE		m.meta_key = 'texto'
                    AND			m.post_id in (select post_id 
                                            from wp_postmeta 
                                            where meta_key = 'tipo_de_postagem' 
                                            and meta_value = 'st')
                    and			m.post_id in (select object_id
                            from wp_term_relationships r 
                                            where r.term_taxonomy_id = 15)
                    ORDER 		BY RAND()
                    LIMIT 		1`
        });

        return result;
    }
}